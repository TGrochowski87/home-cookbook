using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal interface IShoppingListRepository
{
  Task<List<ShoppingList>> GetAll();
  
  Task<Maybe<ShoppingListDetails>> GetById(int id);
  
  Task Remove(int id);

  Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId);
}