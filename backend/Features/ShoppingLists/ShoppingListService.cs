using System.Net;
using Cookbook.Features.ShoppingLists.Update;
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

  public Task<Result<ShoppingListDetails, Error>> GetById(int id)
    => shoppingListRepository.GetById(id);

  public Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId)
    => shoppingListRepository.CreateSublist(shoppingListId, recipeId);

  public Task<UnitResult<Error>> RemoveSublist(int shoppingSublistId)
    => shoppingListRepository.RemoveSublist(shoppingSublistId);

  public Task<UnitResult<Error>> UpdateSublistCount(int shoppingSublistId, decimal count)
    => shoppingListRepository.UpdateSublistCount(shoppingSublistId, count);

  public async Task<Result<ShoppingListDetails, Error>> UpdateShoppingList(int id, ShoppingListUpdate updateData)
  {
    return await shoppingListRepository.GetById(id)
      .Bind(shoppingList => ValidateShoppingListUpdateWithDbData(updateData, shoppingList))
      .Tap(() => shoppingListRepository.UpdateShoppingList(id, updateData)) // Update does not return any expected errors.
      .Bind(() => shoppingListRepository.GetById(id)); // Return updated object.
  }

  private UnitResult<Error> ValidateShoppingListUpdateWithDbData(
    ShoppingListUpdate updateData,
    ShoppingListDetails currentData)
  {
    if (updateData.Sublists.HasNoValue)
    {
      return UnitResult.Success<Error>();
    }

    foreach (var sublistUpdate in updateData.Sublists.Value)
    {
      var sublist = currentData.Sublists.SingleOrDefault(ss => ss.Id == sublistUpdate.Id);
      if (sublist is null)
      {
        return new Error(HttpStatusCode.NotFound, $"Podlista o ID = {sublistUpdate.Id} nie istnieje.");
      }

      var sublistValidationResult = sublistUpdate.State.Match(
        state => ValidateShoppingSublistStateUpdateWithDbData(state, sublist),
        () => sublist.RecipeId.HasNoValue
          ? new Error(HttpStatusCode.BadRequest, "Nie można usunąć manualnej podlisty z listy zakupów.")
          : UnitResult.Success<Error>());

      if (sublistValidationResult.IsFailure)
      {
        return sublistValidationResult;
      }
    }

    return UnitResult.Success<Error>();
  }

  private UnitResult<Error> ValidateShoppingSublistStateUpdateWithDbData(
    ShoppingSublistStateUpdate sublistStateUpdate, 
    ShoppingSublist currentData)
  {
    if (sublistStateUpdate.Items.HasNoValue)
    {
      return UnitResult.Success<Error>();
    }

    foreach (var itemUpdate in sublistStateUpdate.Items.Value)
    {
      var errorMaybe = itemUpdate switch
      {
        ListItemDelete delete when currentData.Items.Any(item => item.Id == delete.Id) == false
          => new Error(HttpStatusCode.NotFound, $"Element o ID = {delete.Id} nie istnieje."),
        ListItemUpdate update when currentData.Items.Any(item => item.Id == update.Id) == false
          => new Error(HttpStatusCode.NotFound, $"Element o ID = {update.Id} nie istnieje."),
        ListItemCreate create when currentData.Items.Any(item => item.Name == create.Name)
          => new Error(HttpStatusCode.BadRequest, $"Element o nazwie {create.Name} już istnieje."),
        _ => UnitResult.Success<Error>()
      };

      if (errorMaybe.IsFailure)
      {
        return errorMaybe;
      }
    }

    return UnitResult.Success<Error>();
  }
}