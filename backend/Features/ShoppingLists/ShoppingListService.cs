namespace Cookbook.Features.ShoppingLists;

internal class ShoppingListService(IShoppingListRepository shoppingListRepository) : IShoppingListService
{
  public Task<List<ShoppingList>> GetAll()
    => shoppingListRepository.GetAll();
}