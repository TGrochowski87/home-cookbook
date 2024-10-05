using Cookbook.Features.ShoppingLists.Update;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal interface IShoppingListService
{
  Task<List<ShoppingList>> GetAll();
  
  Task<Result<ShoppingListDetails, Error>> GetById(int id);
  
  Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId);
  
  Task<UnitResult<Error>> RemoveSublist(int shoppingSublistId);
  
  Task<UnitResult<Error>> UpdateSublistCount(int shoppingSublistId, decimal count);

  Task<Result<ShoppingListDetails, Error>> UpdateShoppingList(int id, ShoppingListUpdate updateData);
}