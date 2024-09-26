using Cookbook.Features.ShoppingLists;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;

namespace Cookbook.Contracts.ShoppingLists;

public class ShoppingListsEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/shopping-lists", GetAllShoppingLists)
      .WithTags("ShoppingLists");
    
    app.MapGet("/shopping-lists/{id:int}", GetShoppingListById)
      .WithTags("ShoppingLists");
    
    app.MapPost("/shopping-lists/{id:int}/sublists", AddRecipeIngredients)
      .WithTags("ShoppingLists");

    app.MapDelete("/shopping-lists/sublists/{sublistId:int}", RemoveRecipeIngredients)
      .WithTags("ShoppingLists");
    
    app.MapPatch("/shopping-lists/sublists/{sublistId:int}", UpdateShoppingSublistCount)
      .WithTags("ShoppingLists")
      .AddFluentValidationAutoValidation();
  }

  private static async Task<Results<NoContent, NotFound<string>>> UpdateShoppingSublistCount(
    [FromServices] IShoppingListService shoppingListService,
    [FromRoute] int sublistId,
    [FromBody] ShoppingSublistUpdateDto dto)
  {
    var result = await shoppingListService.UpdateSublistCount(sublistId, dto.Count);
    return result.Match<Results<NoContent, NotFound<string>>, Error>(
      () => TypedResults.NoContent(), 
      error => TypedResults.NotFound(error.Message));
  }

  private static async Task<Results<NoContent, NotFound<string>>> RemoveRecipeIngredients(
    [FromServices] IShoppingListService shoppingListService,
    [FromRoute] int sublistId)
  {
    var result = await shoppingListService.RemoveSublist(sublistId);
    return result.Match<Results<NoContent, NotFound<string>>, Error>(
      () => TypedResults.NoContent(), 
      error => TypedResults.NotFound(error.Message));
  }

  private static async Task<Results<Created, NotFound<string>>> AddRecipeIngredients(
    [FromServices] IShoppingListService shoppingListService, 
    [FromRoute] int id, 
    [FromBody] ShoppingSublistCreateDto dto)
  {
    var result = await shoppingListService.CreateSublist(id, dto.RecipeId);
    return result.Match<Results<Created, NotFound<string>>, Error>(
      () => TypedResults.Created(),
      error => TypedResults.NotFound(error.Message));
  }
  
  private static async Task<Ok<List<ShoppingListGetDto>>> GetAllShoppingLists(
    [FromServices] IShoppingListService shoppingListService)
  {
    var shoppingLists = await shoppingListService.GetAll();
    var shoppingListDtos = EndpointModelMapper.Map(shoppingLists);
    return TypedResults.Ok(shoppingListDtos);
  }
  
  private static async Task<Results<Ok<ShoppingListDetailsGetDto>, NotFound>> GetShoppingListById(
    [FromServices] IShoppingListService shoppingListService, [FromRoute] int id)
  {
    var shoppingList = await shoppingListService.GetById(id);
    var test = shoppingList.Match<Results<Ok<ShoppingListDetailsGetDto>, NotFound>, ShoppingListDetails>(
      value => TypedResults.Ok(EndpointModelMapper.Map(value)), 
      () => TypedResults.NotFound());

    return test;
  }
}