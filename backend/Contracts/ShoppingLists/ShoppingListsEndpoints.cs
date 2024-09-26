using Cookbook.Features.ShoppingLists;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using IResult = Microsoft.AspNetCore.Http.IResult;

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