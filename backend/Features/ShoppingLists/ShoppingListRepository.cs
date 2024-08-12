using Cookbook.DataAccess;
using Cookbook.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.ShoppingLists;

internal class ShoppingListRepository(CookbookContext context) : IShoppingListRepository
{
  public async Task<List<ShoppingList>> GetAll()
  {
    var entities = await context.ShoppingLists.ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }
}