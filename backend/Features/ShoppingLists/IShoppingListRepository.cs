namespace Cookbook.Features.ShoppingLists;

internal interface IShoppingListRepository
{
  Task<List<ShoppingList>> GetAll();
}