using System.Diagnostics;
using System.Net;
using Cookbook.DataAccess;
using Cookbook.Mappers;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.ShoppingLists;

internal class ShoppingListRepository(CookbookContext context) : IShoppingListRepository
{
  public async Task<List<ShoppingList>> GetAll()
  {
    var entities = await context.ShoppingLists.ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }

  public async Task<Result<ShoppingListDetails, Error>> GetById(int id)
  {
    var entity = await context.ShoppingLists
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(sub => sub.List)
      .ThenInclude(l => l.QuantifiableItems)
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(sub => sub.Recipe)
      .SingleOrDefaultAsync(sl => sl.Id == id);
    
    return entity != null 
      ? RepositoryModelMapper.Map<ShoppingListDetails>(entity) 
      : new Error(HttpStatusCode.NotFound, "Lista o podanym ID nie istnieje.");
  }

  public async Task Remove(int id)
  {
    var shoppingList = await context.ShoppingLists
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(ss => ss.List)
      .SingleOrDefaultAsync(sl => sl.Id == id);
    if (shoppingList is null)
    {
      return;
    }
    
    context.Lists.RemoveRange(shoppingList.ShoppingSublists.Select(ss => ss.List));
    context.ShoppingLists.Remove(shoppingList);
    await context.SaveChangesAsync();
  }

  public async Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId)
  {
    var recipe = await context.Recipes
      .Include(r => r.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(r => r.Id == recipeId);
    if (recipe is null)
    {
      return new Error(HttpStatusCode.NotFound, "Przepis o podanym ID nie istnieje.");
    }

    var list = new List
    {
      QuantifiableItems = recipe.List.QuantifiableItems.Select(item => new QuantifiableItem
      {
        Name = item.Name,
        Checked = item.Checked,
        Unit = item.Unit,
        Value = item.Value,
      }).ToList()
    };
    context.Lists.Add(list);
    await context.SaveChangesAsync();
    
    var shoppingSublist = new DataAccess.ShoppingSublist
    {
      Count = 1,
      RecipeId = recipeId,
      ListId = list.Id,
      ShoppingListId = shoppingListId
    };
    context.ShoppingSublists.Add(shoppingSublist);

    var shoppingList = await context.ShoppingLists.FindAsync(shoppingListId);
    shoppingList!.Updatedate = DateTime.Now;
    
    await context.SaveChangesAsync();
    return UnitResult.Success<Error>();
  }

  public async Task<int> Create(string name)
  {
    var manualSublistList = new List();

    var manualSublist = new DataAccess.ShoppingSublist
    {
      Count = 1,
      RecipeId = null,
      List = manualSublistList
    };
    
    var shoppingList = new DataAccess.ShoppingList
    {
      Name = name,
      ShoppingSublists = [manualSublist],
      Creationdate = DateTime.Now,
      Updatedate = DateTime.Now,
    };
    
    context.ShoppingLists.Add(shoppingList);
    await context.SaveChangesAsync();
    return shoppingList.Id;
  }

  public async Task UpdateShoppingList(int id, ShoppingListUpdate updateData)
  {
    var shoppingList = await context.ShoppingLists
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(ss => ss.List)
      .ThenInclude(l => l.QuantifiableItems)
      .FirstAsync(sl => sl.Id == id);

    shoppingList.Name = updateData.Name;

    foreach (var sublist in shoppingList.ShoppingSublists)
    {
      var correspondingSublistUpdate = updateData.Sublists
        .FirstOrDefault(sl => sl.Id == sublist.Id);
      
      // If the sublist is missing in the update data, it should be removed.
      if (correspondingSublistUpdate == null)
      {
        // This way the cascading delete should also remove the sublist and items.
        context.Lists.Remove(sublist.List);
        continue;
      }

      sublist.Count = correspondingSublistUpdate.Count;

      UpdateExistingListItems(sublist.List.QuantifiableItems, correspondingSublistUpdate.Items);
      UpdateShoppingListByNewItems(sublist.List.QuantifiableItems, correspondingSublistUpdate.Items);
    }
    
    shoppingList.Updatedate = DateTime.Now;
    await context.SaveChangesAsync();
  }

  private void UpdateShoppingListByNewItems(ICollection<QuantifiableItem> currentListItems, IEnumerable<ShoppingListItemUpdate> updates)
  {
    // Update item data without ID means that it is new and should be created.
    foreach (var newItem in updates.Where(item => item.Id.HasNoValue))
    {
      var item = new QuantifiableItem
      {
        Name = newItem.Name,
        Checked = newItem.Checked,
        Unit = newItem.Amount.Unit.GetValueOrDefault(),
        Value = newItem.Amount.Value
      };
      currentListItems.Add(item);
    }
  }

  private void UpdateExistingListItems(ICollection<QuantifiableItem> currentListItems, List<ShoppingListItemUpdate> updates)
  {
    foreach (var item in currentListItems)
    {
      var correspondingItemUpdate = updates.FirstOrDefault(i => i.Id == item.Id);
        
      // If the item is missing in the update data, it should be removed.
      if (correspondingItemUpdate == null)
      {
        context.Entry(item).State = EntityState.Deleted;
        continue;
      }
        
      item.Name = correspondingItemUpdate.Name;
      item.Checked = correspondingItemUpdate.Checked;
      item.Unit = correspondingItemUpdate.Amount.Unit.GetValueOrDefault();
      item.Value = correspondingItemUpdate.Amount.Value;
    }
  }
}