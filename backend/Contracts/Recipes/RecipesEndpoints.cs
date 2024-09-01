using Cookbook.Features.Recipes;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Cookbook.Features.Images;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;

namespace Cookbook.Contracts.Recipes;

public class RecipesEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/recipes", GetAllRecipes)
      .WithTags("Recipes");
    
    app.MapGet("/recipes/{id:int}", GetRecipeById)
      .WithTags("Recipes");

    app.MapGet("/recipes/images/{fileName}", GetFile)
      .WithTags("Recipes");

    app.MapPost("/recipes", CreateRecipe)
      .WithTags("Recipes")
      .DisableAntiforgery() // TODO
      .AddFluentValidationAutoValidation();
  }

  private static async Task<Ok<List<RecipeGetDto>>> GetAllRecipes(
    [FromServices] IRecipeService recipeService)
  {
    var recipes = await recipeService.GetAll();
    var recipeDtos = EndpointModelMapper.Map(recipes);
    return TypedResults.Ok(recipeDtos);
  }
  
  private static async Task<Results<Ok<RecipeDetailsGetDto>, NotFound>> GetRecipeById(
    [FromServices] IRecipeService recipeService, 
    [FromRoute] int id)
  {
    var recipe = await recipeService.GetById(id);
    return recipe.Match<Results<Ok<RecipeDetailsGetDto>, NotFound>, RecipeDetailsGet>(
      value => TypedResults.Ok(EndpointModelMapper.Map(value)), 
      () => TypedResults.NotFound());
  }

  private static async Task<Results<Created<int>, NotFound>> CreateRecipe(
    [FromServices] IRecipeService recipeService,
    [FromForm] RecipeCreateDto dto)
  {
    var recipeCreate = EndpointModelMapper.Map(dto);
    var result = await recipeService.Create(recipeCreate);
    
    return result.Match(
      recipeId => TypedResults.Created((string?)null, recipeId),
      ErrorResponseCreator.Create<Results<Created<int>, NotFound>>); // TODO: Consider proper URL
  }

  private static Results<FileStreamHttpResult, NotFound, ProblemHttpResult> GetFile(
      [FromServices] IImageService imageService,
      [FromRoute] string fileName)
  {
    var result = imageService.Get(fileName);

    return result.Match(
      fileStream => TypedResults.Stream(fileStream, MimeTypeFromExtension(fileName.Split(", ")[^1])),
      ErrorResponseCreator.Create<Results<FileStreamHttpResult, NotFound, ProblemHttpResult>>);
  }

  private static string MimeTypeFromExtension(string extension)
  {
    return extension switch
    {
      ".jpg" or ".jpeg" => "image/jpeg",
      ".png" => "image/png",
      ".webp" => "image/webp",
      _ => throw new NotSupportedException()
    };
  }
}