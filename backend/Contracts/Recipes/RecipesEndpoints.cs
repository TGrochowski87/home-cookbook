using Cookbook.Features.Recipes;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Recipes;

public class RecipesEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/recipes", GetAllRecipes)
      .Produces<List<RecipeGetDto>>()
      .WithTags("Recipes");
  }
  
  private static async Task<IResult> GetAllRecipes([FromServices] IRecipeService recipeService)
  {
    var recipes = await recipeService.GetAll();
    var recipeDtos = EndpointModelMapper.Map(recipes);
    return Results.Ok(recipeDtos);
  }
}