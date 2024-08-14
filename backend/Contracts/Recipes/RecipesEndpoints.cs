using Cookbook.Features.Recipes;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Cookbook.Contracts.Recipes;

public class RecipesEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/recipes", GetAllRecipes)
      .WithTags("Recipes");
    
    app.MapGet("/recipes/{id}", GetRecipeById)
      .WithTags("Recipes");
  }

  private static async Task<Ok<List<RecipeGetDto>>> GetAllRecipes([FromServices] IRecipeService recipeService)
  {
    var recipes = await recipeService.GetAll();
    var recipeDtos = EndpointModelMapper.Map(recipes);
    return TypedResults.Ok(recipeDtos);
  }
  
  private static async Task<Results<Ok<RecipeDetailsGetDto>, NotFound>> GetRecipeById([FromServices] IRecipeService recipeService, [FromRoute] int id)
  {
    var recipe = await recipeService.GetById(id);
    return recipe.Match<Results<Ok<RecipeDetailsGetDto>, NotFound>, RecipeDetails>(
      value => TypedResults.Ok(EndpointModelMapper.Map(value)), 
      () => TypedResults.NotFound());
  }
}