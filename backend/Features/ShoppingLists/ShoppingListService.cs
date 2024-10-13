﻿using System.Net;
using Cookbook.Features.Common;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal class ShoppingListService(IShoppingListRepository shoppingListRepository) : IShoppingListService
{
  public async Task<List<ShoppingList>> GetAll()
  {
    var shoppingLists = await shoppingListRepository.GetAll();
    var groupedByExpirationStatus = shoppingLists.GroupBy(sl => DateTime.Now > sl.CreationDate.AddMonths(1)).ToList();

    // Removing overdue shopping lists
    var overdueShoppingLists = groupedByExpirationStatus.FirstOrDefault(group => group.Key);
    if (overdueShoppingLists is not null)
    {
      foreach (var shoppingList in overdueShoppingLists)
      {
        await shoppingListRepository.Remove(shoppingList.Id);
      }
    }

    var shoppingListsLeft = groupedByExpirationStatus.FirstOrDefault(group => group.Key == false)?.ToList() ?? [];
    shoppingListsLeft.Sort((a, b) => b.UpdateDate.CompareTo(a.UpdateDate));

    return shoppingListsLeft;
  }

  public Task<Result<ShoppingListDetails, Error>> GetById(int id)
    => shoppingListRepository.GetById(id);

  public Task<UnitResult<Error>> CreateSublist(int shoppingListId, int recipeId)
    => shoppingListRepository.CreateSublist(shoppingListId, recipeId);

  public Task<int> Create(string name) 
    => shoppingListRepository.Create(name);

  public async Task<Result<ShoppingListDetails, Error>> UpdateShoppingList(
    int id, 
    DateTime resourceStateTimestampFromRequest, 
    ShoppingListUpdate updateData)
  {
    return await shoppingListRepository.GetById(id)
      .Check(shoppingList => CommonResourceValidator.VerifyResourceStateNotOutdated(resourceStateTimestampFromRequest, shoppingList.UpdateDate))
      .Bind(shoppingList => ValidateShoppingListUpdateWithDbData(updateData, shoppingList))
      .Tap(() => shoppingListRepository.UpdateShoppingList(id, updateData)) // Update does not return any expected errors.
      .Bind(() => shoppingListRepository.GetById(id)); // Return updated object.
  }

  private static UnitResult<Error> ValidateShoppingListUpdateWithDbData(
    ShoppingListUpdate updateData,
    ShoppingListDetails currentData)
  {
    var manualListId = currentData.Sublists.First(sl => sl.RecipeId.HasNoValue).Id;
    if (updateData.Sublists.Any(slUpdate => slUpdate.Id == manualListId) == false)
    {
      return new Error(HttpStatusCode.BadRequest,
        "Manualna podlista nie może zostać usunięta z listy zakupów.");
    }

    var existentSublistIds = updateData.Sublists.Select(sl => sl.Id).ToList();
    var existentItemIds = currentData.Sublists
      .SelectMany(sl => sl.Items)
      .Select(i => i.Id).ToList();

    foreach (var sublistUpdate in updateData.Sublists)
    {
      if (existentSublistIds.Contains(sublistUpdate.Id) == false)
      {
        return new Error(HttpStatusCode.NotFound, $"Podlista o ID = {sublistUpdate.Id} nie istnieje.");
      }

      foreach (var itemUpdate in sublistUpdate.Items.Where(item => item.Id.HasValue))
      {
        if (existentItemIds.Contains((int)itemUpdate.Id.Value!) == false)
        {
          return new Error(HttpStatusCode.NotFound, $"Przedmiot o ID = {itemUpdate.Id} nie istnieje.");
        }
      }
    }

    return UnitResult.Success<Error>();
  }
}