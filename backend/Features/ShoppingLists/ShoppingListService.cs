using System.Net;
using Cookbook.Features.Common;
using Cookbook.Features.ShoppingLists.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal class ShoppingListService(IShoppingListRepository shoppingListRepository, ILogger<ShoppingListService> logger)
  : IShoppingListService
{
  const int _daysTillExpiration = 14;
  
  public async Task<List<ShoppingList>> GetAll()
  {
    var shoppingLists = await shoppingListRepository.GetAll();
    var groupedByExpirationStatus = shoppingLists
      .GroupBy(sl => sl.AutoDelete && DateTime.UtcNow > sl.CreationDate.AddDays(_daysTillExpiration))
      .ToList();

    // Removing overdue shopping lists
    var overdueShoppingLists = groupedByExpirationStatus.FirstOrDefault(group => group.Key);
    if (overdueShoppingLists is not null)
    {
      logger.LogInformation("Current UTC time: {CurrentTime}", DateTime.UtcNow);
      foreach (var shoppingList in overdueShoppingLists)
      {
        logger.LogInformation(
          "Removing overdue shopping list with ID = {ShoppingListId}. Creation date: {CreationDate}.", 
          shoppingList.Id,
          shoppingList.CreationDate.ToLocalTime());
        await shoppingListRepository.Remove(shoppingList.Id);
      }
    }

    var shoppingListsLeft = groupedByExpirationStatus.FirstOrDefault(group => group.Key == false)?.ToList() ?? [];
    shoppingListsLeft.Sort((a, b) => b.UpdateDate.CompareTo(a.UpdateDate));

    return shoppingListsLeft;
  }

  public async Task<Result<ShoppingListDetails, Error>> GetById(int id)
    => await shoppingListRepository.GetById(id);

  public async Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId)
  {
    return await shoppingListRepository.GetById(shoppingListId)
      .Check(shoppingList => VerifyRecipeIsNotOnShoppingList(shoppingList, recipeId))
      .Bind(_ => shoppingListRepository.CreateSublist(shoppingListId, recipeId));
  }

  public async Task<Result<ShoppingListDetails, Error>> Create(string name)
  {
    var shoppingListId = await shoppingListRepository.Create(name);
    return await shoppingListRepository.GetById(shoppingListId);
  }

  public async Task<Result<ShoppingListDetails, Error>> UpdateShoppingList(
    int id,
    DateTime resourceStateTimestampFromRequest,
    ShoppingListUpdate updateData)
  {
    return await shoppingListRepository.GetById(id)
      .Tap(shoppingList => logger.LogInformation("Update date passed: {PassedUpdateDate}\nUpdate date from DB: {DBUpdateDate}", 
        resourceStateTimestampFromRequest, shoppingList.UpdateDate))
      .Check(shoppingList =>
        CommonResourceValidator.VerifyResourceStateNotOutdated(resourceStateTimestampFromRequest, shoppingList.UpdateDate))
      .Bind(shoppingList => ValidateShoppingListUpdateWithDbData(updateData, shoppingList))
      .Tap(() => shoppingListRepository.UpdateShoppingList(id, updateData)) // Update does not return any expected errors.
      .Bind(() => shoppingListRepository.GetById(id)); // Return updated object.
  }

  public async Task<UnitResult<Error>> Remove(int id, DateTime resourceStateTimestampFromRequest)
  {
    return await shoppingListRepository.GetById(id)
      .Tap(shoppingList => logger.LogInformation("Update date passed: {PassedUpdateDate}\nUpdate date from DB: {DBUpdateDate}", 
        resourceStateTimestampFromRequest, shoppingList.UpdateDate))
      .Check(shoppingList =>
        CommonResourceValidator.VerifyResourceStateNotOutdated(resourceStateTimestampFromRequest, shoppingList.UpdateDate))
      .Tap(() => shoppingListRepository.Remove(id));
  }

  private static UnitResult<Error> VerifyRecipeIsNotOnShoppingList(ShoppingListDetails shoppingList, int recipeId)
  {
    return shoppingList.Sublists.Any(sl => sl.RecipeId == recipeId)
      ? new Error(HttpStatusCode.Conflict, "The recipe's ingredients are already on the shopping list.")
      : UnitResult.Success<Error>();
  }

  private static UnitResult<Error> ValidateShoppingListUpdateWithDbData(
    ShoppingListUpdate updateData,
    ShoppingListDetails currentData)
  {
    var manualListId = currentData.Sublists.First(sl => sl.RecipeId.HasNoValue).Id;
    if (updateData.Sublists.Any(slUpdate => slUpdate.Id == manualListId) == false)
    {
      return new Error(HttpStatusCode.BadRequest,
        "The custom sublist cannot be removed from the shopping list.");
    }

    var existentSublistIds = updateData.Sublists.Select(sl => sl.Id).ToList();
    var existentItemIds = currentData.Sublists
      .SelectMany(sl => sl.Items)
      .Select(i => i.Id).ToList();

    foreach (var sublistUpdate in updateData.Sublists)
    {
      if (existentSublistIds.Contains(sublistUpdate.Id) == false)
      {
        return new Error(HttpStatusCode.NotFound, $"The sublist of ID = {sublistUpdate.Id} does not exist."); 
      }

      foreach (var itemUpdate in sublistUpdate.Items.Where(item => item.Id.HasValue))
      {
        if (existentItemIds.Contains((int)itemUpdate.Id.Value!) == false)
        {
          return new Error(HttpStatusCode.NotFound, $"The item of ID = {itemUpdate.Id} does not exist.");
        }
      }
    }

    return UnitResult.Success<Error>();
  }
}