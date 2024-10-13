using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal interface IShoppingListService
{
  Task<List<ShoppingList>> GetAll();
  
  Task<Result<ShoppingListDetails, Error>> GetById(int id);
  
  Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId);
  
  Task<int> Create(string name);

  Task<Result<ShoppingListDetails, Error>> UpdateShoppingList(
    int id, 
    DateTime resourceStateTimestampFromRequest, 
    ShoppingListUpdate updateData);
}