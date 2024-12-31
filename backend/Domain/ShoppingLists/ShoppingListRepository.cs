using System.Net;
using Cookbook.DataAccess;
using Cookbook.Domain.ShoppingLists.Models;
using Cookbook.Mappers;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using ShoppingList = Cookbook.Domain.ShoppingLists.Models.ShoppingList;

namespace Cookbook.Domain.ShoppingLists;

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
      : new Error(HttpStatusCode.NotFound, $"The list of ID = {id} does not exist.");
  }

  public async Task Remove(int id)
  {
    var subListsListIds = await context.ShoppingLists
      .Include(sl => sl.ShoppingSublists)
      .Where(sl => sl.Id == id)
      .SelectMany(sl => sl.ShoppingSublists.Select(ss => ss.ListId))
      .ToListAsync();
    
    if (subListsListIds.Count == 0)
    {
      return;
    }
    
    // Deleting by removing entities from DBSets by 'Remove' creates a separate DELETE call for every entity.
    // These two expressions result in two DELETE calls.
    await context.Lists.Where(l => subListsListIds.Contains(l.Id)).ExecuteDeleteAsync();
    await context.ShoppingLists.Where(sl => sl.Id == id).ExecuteDeleteAsync();
  }

  public async Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId)
  {
    var recipe = await context.Recipes
      .Include(r => r.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(r => r.Id == recipeId);
    if (recipe is null)
    {
      return new Error(HttpStatusCode.NotFound, $"The recipe of ID = {recipeId} does not exist.");
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
      Autodelete = true,
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
        Value = newItem.Amount.Value.GetValueOrDefault()
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
      item.Value = correspondingItemUpdate.Amount.Value.GetValueOrDefault();
    }
  }
}