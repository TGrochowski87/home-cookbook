using Cookbook.Features.Recipes;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;
using CSharpFunctionalExtensions;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace Cookbook.Contracts.Recipes;

public class RecipesEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/recipes", GetAllRecipes)
      .Produces<List<RecipeGetDto>>()
      .WithTags("Recipes");
    
    app.MapGet("/recipes/{id}", GetRecipeById)
      .Produces<RecipeGetDto>()
      .WithTags("Recipes");
  }

  private static async Task<IResult> GetAllRecipes([FromServices] IRecipeService recipeService)
  {
    var recipes = await recipeService.GetAll();
    var recipeDtos = EndpointModelMapper.Map(recipes);
    return Results.Ok(recipeDtos);
  }
  
  private static async Task<IResult> GetRecipeById([FromServices] IRecipeService recipeService, [FromRoute] int id)
  {
    var recipe = await recipeService.GetById(id);
    return recipe.Match(
      value => Results.Ok(EndpointModelMapper.Map(value)), 
      () => Results.NotFound());
  }
}