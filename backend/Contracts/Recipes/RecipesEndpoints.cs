using System.Diagnostics;
using System.Net;
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
  
  private static async Task<Results<Ok<RecipeDetailsGetDto>, NotFound<string>>> GetRecipeById(
    [FromServices] IRecipeService recipeService, 
    [FromRoute] int id)
  {
    var recipe = await recipeService.GetById(id);
    return recipe.Match<Results<Ok<RecipeDetailsGetDto>, NotFound<string>>, RecipeDetailsGet>(
      value => TypedResults.Ok(EndpointModelMapper.Map(value)), 
      () => TypedResults.NotFound("Przepis o podanym ID nie istnieje."));
  }

  private static async Task<Results<Created<int>, NotFound<string>>> CreateRecipe(
    [FromServices] IRecipeService recipeService,
    [FromForm] RecipeCreateDto dto)
  {
    var recipeCreate = EndpointModelMapper.Map(dto);
    var result = await recipeService.Create(recipeCreate);
    
    return result.Match<int, Results<Created<int>, NotFound<string>>, Error>(
      recipeId => TypedResults.Created((string?)null, recipeId), // TODO: Consider proper URL
      error => error.StatusCode switch
      {
        HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
        _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
      });
  }

  private static async Task<Results<FileContentHttpResult, NotFound<string>, ProblemHttpResult>> GetFile(
      [FromServices] IImageService imageService,
      [FromRoute] string fileName)
  {
    var result = await imageService.Get(fileName);
    
    return result.Match<byte[], Results<FileContentHttpResult, NotFound<string>, ProblemHttpResult>, Error>(
      file => TypedResults.File(file, MimeTypeFromExtension(Path.GetExtension(fileName).ToLowerInvariant())),
      error => error.StatusCode switch
      {
        HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
        HttpStatusCode.UnsupportedMediaType => TypedResults.Problem(detail: error.Message, statusCode: (int?)error.StatusCode),
        _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
      });
  }

  private static string MimeTypeFromExtension(string extension)
  {
    return extension switch
    {
      ".jpg" or ".jpeg" => "image/jpeg",
      ".png" => "image/png",
      ".webp" => "image/webp",
      _ => throw new NotSupportedException($"Image format {extension} is not supported.")
    };
  }
}