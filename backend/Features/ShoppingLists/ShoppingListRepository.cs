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

  public async Task<UnitResult<Error>> RemoveSublist(int shoppingSublistId)
  {
    var shoppingSublist = await context.ShoppingSublists
      .SingleOrDefaultAsync(ss => ss.Id == shoppingSublistId);
    if (shoppingSublist is null)
    {
      return new Error(HttpStatusCode.NotFound, "Podlista o podanym ID nie istnieje.");
    }
    
    context.ShoppingSublists.Remove(shoppingSublist);
    await context.SaveChangesAsync();
    
    return UnitResult.Success<Error>();
  }

  public async Task<UnitResult<Error>> UpdateSublistCount(int shoppingSublistId, decimal count)
  {
    var shoppingSublist = await context.ShoppingSublists
      .SingleOrDefaultAsync(ss => ss.Id == shoppingSublistId);
    if (shoppingSublist is null)
    {
      return new Error(HttpStatusCode.NotFound, "Podlista o podanym ID nie istnieje.");
    }
    
    shoppingSublist.Count = count;
    await context.SaveChangesAsync();
    
    return UnitResult.Success<Error>();
  }
  
  public async Task<UnitResult<Error>> UpdateShoppingList(int id, ShoppingListUpdate updateData)
  {
    var shoppingList = await context.ShoppingLists
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(ss => ss.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(sl => sl.Id == id);
    
    if (shoppingList is null)
    {
      return new Error(HttpStatusCode.NotFound, "Lista o podanym ID nie istnieje.");
    }
    
    
    shoppingList.Name = updateData.Name.HasValue ? updateData.Name.Value : shoppingList.Name;

    if (updateData.Sublists.HasValue)
    {
      foreach (var sublistUpdate in updateData.Sublists.Value)
      {
        var sublist = shoppingList.ShoppingSublists.SingleOrDefault(ss => ss.Id == sublistUpdate.Id);
        if (sublist is null)
        {
          return new Error(HttpStatusCode.NotFound, $"Podlista o ID = {sublistUpdate.Id} nie istnieje.");
        }
        
        if (sublistUpdate.State.HasNoValue)
        {
          if (sublist.RecipeId is null)
          {
            return new Error(HttpStatusCode.BadRequest)
          }
        }
      }
    }
    
    
    shoppingList.Updatedate = DateTime.Now;
    await context.SaveChangesAsync();
    
    return UnitResult.Success<Error>();
  }
}