using System.Diagnostics;
using System.Net;
using Cookbook.Domain.ShoppingLists;
using Cookbook.Domain.ShoppingLists.Models;
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

    app.MapPost("/shopping-lists", CreateShoppingList)
      .WithTags("ShoppingLists")
      .AddFluentValidationAutoValidation();

    app.MapPut("/shopping-lists/{id:int}", OverrideShoppingList)
      .WithTags("ShoppingLists")
      .AddFluentValidationAutoValidation();
  }

  private static async Task<Created<ShoppingListDetailsGetDto>> CreateShoppingList(
    [FromServices] IShoppingListService shoppingListService,
    [FromBody] ShoppingListCreateDto dto)
  {
    var result = await shoppingListService.Create(dto.Name);

    // NotFound ignored as it should not be possible.
    return TypedResults.Created((string?)null, EndpointModelMapper.Map(result.Value));
  }

  private static async Task<Results<Ok<ShoppingListDetailsGetDto>, NotFound<string>, BadRequest<string>, ProblemHttpResult>> OverrideShoppingList(
      [FromServices] IShoppingListService shoppingListService,
      [FromRoute] int id,
      [FromBody] ShoppingListUpdateDto dto,
      [FromHeader(Name = "If-Unmodified-Since")] DateTime resourceStateTimestamp)
  {
    var shoppingListUpdate = EndpointModelMapper.Map(dto);
    var result = await shoppingListService.UpdateShoppingList(id, resourceStateTimestamp, shoppingListUpdate);

    return result
      .Match<ShoppingListDetails, Results<Ok<ShoppingListDetailsGetDto>, NotFound<string>, BadRequest<string>, ProblemHttpResult>, Error>(
        shoppingList => TypedResults.Ok(EndpointModelMapper.Map(shoppingList)),
        error => error.StatusCode switch
        {
          HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
          HttpStatusCode.BadRequest => TypedResults.BadRequest(error.Message),
          HttpStatusCode.PreconditionFailed => TypedResults.Problem(statusCode: (int)HttpStatusCode.PreconditionFailed, detail: error.Message),
          _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
        });
  }

  private static async Task<Results<Created, NotFound<string>, Conflict<string>>> AddRecipeIngredients(
    [FromServices] IShoppingListService shoppingListService,
    [FromRoute] int id,
    [FromBody] ShoppingSublistCreateDto dto)
  {
    var result = await shoppingListService.CreateSublist(id, dto.RecipeId);
    return result.Match<Results<Created, NotFound<string>, Conflict<string>>, Error>(
      () => TypedResults.Created(),
      error => error.StatusCode switch
      {
        HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
        HttpStatusCode.Conflict => TypedResults.Conflict(error.Message),
        _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
      });
  }

  private static async Task<Ok<List<ShoppingListGetDto>>> GetAllShoppingLists(
    [FromServices] IShoppingListService shoppingListService)
  {
    var shoppingLists = await shoppingListService.GetAll();
    var shoppingListDtos = EndpointModelMapper.Map(shoppingLists);
    return TypedResults.Ok(shoppingListDtos);
  }

  private static async Task<Results<Ok<ShoppingListDetailsGetDto>, NotFound<string>>> GetShoppingListById(
    [FromServices] IShoppingListService shoppingListService, [FromRoute] int id)
  {
    var shoppingList = await shoppingListService.GetById(id);
    return shoppingList.Match<ShoppingListDetails, Results<Ok<ShoppingListDetailsGetDto>, NotFound<string>>, Error>(
      value => TypedResults.Ok(EndpointModelMapper.Map(value)),
      error => error.StatusCode switch
      {
        HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
        _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
      });
  }
}