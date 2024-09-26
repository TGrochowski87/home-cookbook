using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal class ShoppingListService(IShoppingListRepository shoppingListRepository) : IShoppingListService
{
  public async Task<List<ShoppingList>> GetAll()
  {
    var shoppingLists = await shoppingListRepository.GetAll();
    var test = shoppingLists.GroupBy(sl => DateTime.Now > sl.CreationDate.AddMonths(1)).ToList();

    var overdueShoppingLists = test.FirstOrDefault(group => group.Key);
    if (overdueShoppingLists is not null)
    {
      foreach (var shoppingList in overdueShoppingLists)
      {
        await shoppingListRepository.Remove(shoppingList.Id);
      }
    }
    
    return test.FirstOrDefault(group => group.Key == false)?.ToList() ?? [];
  }

  public Task<Maybe<ShoppingListDetails>> GetById(int id) 
    => shoppingListRepository.GetById(id);

  public Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId) 
    => shoppingListRepository.CreateSublist(shoppingListId, recipeId);

  public Task<UnitResult<Error>> RemoveSublist(int shoppingSublistId)
    => shoppingListRepository.RemoveSublist(shoppingSublistId);

  public Task<UnitResult<Error>> UpdateSublistCount(int shoppingSublistId, int count) 
    => shoppingListRepository.UpdateSublistCount(shoppingSublistId, count);
}