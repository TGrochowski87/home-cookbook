namespace Cookbook.Features.ShoppingLists;

internal interface IShoppingListService
{
  Task<List<ShoppingList>> GetAll();
}