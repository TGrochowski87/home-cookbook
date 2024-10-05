using System.Diagnostics;
using System.Net;
using Cookbook.DataAccess;
using Cookbook.Features.ShoppingLists.Update;
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
    await context.SaveChangesAsync();
    return UnitResult.Success<Error>();
  }
  
  public async Task UpdateShoppingList(int id, ShoppingListUpdate updateData)
  {
    var shoppingList = await context.ShoppingLists
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(ss => ss.List)
      .ThenInclude(l => l.QuantifiableItems)
      .FirstAsync(sl => sl.Id == id);
    
    shoppingList.Name = updateData.Name.HasValue ? updateData.Name.Value : shoppingList.Name;

    if (updateData.Sublists.HasValue)
    {
      foreach (var sublistUpdate in updateData.Sublists.Value)
      {
        var sublist = shoppingList.ShoppingSublists.First(ss => ss.Id == sublistUpdate.Id);

        if (sublistUpdate.State.HasNoValue)
        {
          // This way the cascading delete should also remove the sublist and items.
          context.Lists.Remove(sublist.List);
          continue;
        }

        sublist.Count = sublistUpdate.State.HasValue 
          ? (decimal)sublistUpdate.State.Value.Count.Value! 
          : sublist.Count;

        if(sublistUpdate.State.Value.Items.HasValue)
        {
          var sublistItems = sublistUpdate.State.Value.Items.Value;
          sublistItems.ForEach(item => ProcessShoppingListItemChange(sublist, item));
        }
      }
    }
    
    shoppingList.Updatedate = DateTime.Now;
    await context.SaveChangesAsync();
  }

  private void ProcessShoppingListItemChange(DataAccess.ShoppingSublist relatedSublist, ListItemRelatedChange listItemChange)
  {
    switch (listItemChange)
    {
      case ListItemDelete delete:
        {
          var item = relatedSublist.List.QuantifiableItems.First(item => item.Id == delete.Id);
          context.QuantifiableItems.Remove(item);
          break;
        }
      case ListItemUpdate update:
        {
          var item = relatedSublist.List.QuantifiableItems.First(item => item.Id == update.Id);
          item.Checked = update.Checked;
          break;
        }
      case ListItemCreate create:
        {
          var newItem = new QuantifiableItem
          {
            Name = create.Name,
            Value = create.Amount.Value,
            Unit = create.Amount.Unit.GetValueOrDefault(),
            Checked = create.Checked
          };
          relatedSublist.List.QuantifiableItems.Add(newItem);
          break;
        }
    }
  }
}