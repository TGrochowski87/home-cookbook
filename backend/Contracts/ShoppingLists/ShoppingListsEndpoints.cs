using Cookbook.Features.ShoppingLists;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.ShoppingLists;

public class ShoppingListsEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/shopping-lists", GetAllShoppingLists)
      .Produces<List<ShoppingListGetDto>>()
      .WithTags("ShoppingLists");
  }
  
  private static async Task<IResult> GetAllShoppingLists([FromServices] IShoppingListService shoppingListService)
  {
    var shoppingLists = await shoppingListService.GetAll();
    var shoppingListDtos = EndpointModelMapper.Map(shoppingLists);
    return Results.Ok(shoppingListDtos);
  }
}