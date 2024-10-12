using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal interface IShoppingListRepository
{
  Task<List<ShoppingList>> GetAll();
  
  Task<Result<ShoppingListDetails, Error>> GetById(int id);
  
  Task Remove(int id);

  Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId);
  
  Task UpdateShoppingList(int id, ShoppingListUpdate updateData);
}