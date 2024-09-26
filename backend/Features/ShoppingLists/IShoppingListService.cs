using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal interface IShoppingListService
{
  Task<List<ShoppingList>> GetAll();
  
  Task<Maybe<ShoppingListDetails>> GetById(int id);
  
  Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId);
}