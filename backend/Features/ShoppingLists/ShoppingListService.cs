using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal class ShoppingListService(IShoppingListRepository shoppingListRepository) : IShoppingListService
{
  public Task<List<ShoppingList>> GetAll()
    => shoppingListRepository.GetAll();

  public Task<Maybe<ShoppingListDetails>> GetById(int id) 
    => shoppingListRepository.GetById(id);
}