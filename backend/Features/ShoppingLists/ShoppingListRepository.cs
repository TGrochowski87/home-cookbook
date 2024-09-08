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

  public async Task<Maybe<ShoppingListDetails>> GetById(int id)
  {
    var entity = await context.ShoppingLists
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(sub => sub.List)
      .ThenInclude(l => l.QuantifiableItems)
      .Include(sl => sl.ShoppingSublists)
      .ThenInclude(sub => sub.Recipe)
      .SingleOrDefaultAsync(sl => sl.Id == id);
    
    return entity != null ? RepositoryModelMapper.Map<ShoppingListDetails>(entity) : Maybe<ShoppingListDetails>.None;
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
}