using System.Diagnostics;
using System.Net;
using System.Text;
using Cookbook.Domain.Images;
using Cookbook.Domain.Recipes;
using Cookbook.Domain.Recipes.Models;
using Cookbook.Extensions;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;

namespace Cookbook.Contracts.Recipes;

public class RecipesEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/recipes", GetRecipes)
      .WithTags("Recipes");

    app.MapGet("/recipes/{id:int}", GetRecipeById)
      .WithTags("Recipes");

    app.MapGet("/recipes/images/{fileName}", GetFile)
      .WithTags("Recipes");

    app.MapPost("/recipes", CreateRecipe)
      .WithTags("Recipes")
      .DisableAntiforgery()
      .AddFluentValidationAutoValidation();

    app.MapPut("/recipes/{id:int}", OverrideRecipe)
      .WithTags("Recipes")
      .DisableAntiforgery()
      .AddFluentValidationAutoValidation();
  }

  private static async Task<Ok<GetRecipesResponseDto>> GetRecipes(
    HttpRequest request,
    [FromServices] IRecipeService recipeService,
    [AsParameters] GetRecipesQueryParamsDto queryParamsDto)
  {
    var query = EndpointModelMapper.Map(queryParamsDto);
    var getRecipesResult = await recipeService.GetMany(query);
    var recipeDtos = EndpointModelMapper.Map(getRecipesResult.recipes, request.GetBaseUrl());

    if (getRecipesResult.isLastPage)
    {
      return TypedResults.Ok(new GetRecipesResponseDto(null, recipeDtos));
    }

    var nextPageUrl = ConstructGetRecipesNextPageUrl(request, query, getRecipesResult.recipes.Last());
    var response = new GetRecipesResponseDto(nextPageUrl, recipeDtos);
      
    return TypedResults.Ok(response);
  }

  private static async Task<Results<Ok<RecipeDetailsGetDto>, NotFound<string>>> GetRecipeById(
    HttpRequest request,
    [FromServices] IRecipeService recipeService,
    [FromRoute] int id)
  {
    var recipe = await recipeService.GetById(id);
    
    return recipe.Match<RecipeDetailsGet, Results<Ok<RecipeDetailsGetDto>, NotFound<string>>, Error>(
      value => TypedResults.Ok(EndpointModelMapper.Map(value, request.GetBaseUrl())),
      error => error.StatusCode switch
      {
        HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
        _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
      });
  }

  private static async Task<Results<Created<RecipeDetailsGetDto>, NotFound<string>>> CreateRecipe(
    HttpRequest request,
    [FromServices] IRecipeService recipeService,
    [FromForm] RecipeCreateDto dto)
  {
    var recipeCreate = EndpointModelMapper.Map(dto);
    var result = await recipeService.Create(recipeCreate);

    return result.Match<RecipeDetailsGet, Results<Created<RecipeDetailsGetDto>, NotFound<string>>, Error>(
      value => TypedResults.Created((string?)null, EndpointModelMapper.Map(value, request.GetBaseUrl())), // TODO: Consider proper URL
      error => error.StatusCode switch
      {
        HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
        _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
      });
  }

  private static async Task<Results<Ok<RecipeDetailsGetDto>, NotFound<string>, ProblemHttpResult>> OverrideRecipe(
    HttpRequest request,
    [FromServices] IRecipeService recipeService,
    [FromRoute] int id,
    [FromForm] RecipeCreateDto dto,
    [FromHeader(Name = "If-Unmodified-Since")] DateTime resourceStateTimestamp)
  {
    var recipeCreate = EndpointModelMapper.Map(dto);
    var result = await recipeService.Update(id, resourceStateTimestamp, recipeCreate);

    return result.Match<RecipeDetailsGet, Results<Ok<RecipeDetailsGetDto>, NotFound<string>, ProblemHttpResult>, Error>(
      value => TypedResults.Ok(EndpointModelMapper.Map(value, request.GetBaseUrl())), // TODO: Consider proper URL
      error => error.StatusCode switch
      {
        HttpStatusCode.NotFound => TypedResults.NotFound(error.Message),
        HttpStatusCode.PreconditionFailed => TypedResults.Problem(statusCode: (int)HttpStatusCode.PreconditionFailed, detail: error.Message),
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
        HttpStatusCode.UnsupportedMediaType => TypedResults.Problem(detail: error.Message,
          statusCode: (int?)error.StatusCode),
        _ => throw new UnreachableException($"Received unexpected status code: {error.StatusCode}.")
      });
  }

  private static Uri ConstructGetRecipesNextPageUrl(
    HttpRequest request, 
    GetRecipesQueryParams currentRequestQuery, 
    RecipeGet lastRecipeFromCurrentPage)
  {
    var stringBuilder = new StringBuilder();

    var pathBase = request.GetBaseUrl();
    stringBuilder.Append($"{pathBase}/recipes?");

    if (currentRequestQuery.Filtering.HasValue)
    {
      if (currentRequestQuery.Filtering.Value.Name.HasValue)
      {
        stringBuilder.Append($"name={currentRequestQuery.Filtering.Value.Name.Value}&");
      }
      if (currentRequestQuery.Filtering.Value.Category.HasValue)
      {
        stringBuilder.Append($"category={currentRequestQuery.Filtering.Value.Category.Value}&");
      }
      if (currentRequestQuery.Filtering.Value.Tags.Length > 0)
      {
        stringBuilder.Append($"tags={string.Join(',', currentRequestQuery.Filtering.Value.Tags)}&");
      }
    }

    stringBuilder.Append(
      $"lastName={lastRecipeFromCurrentPage.Name.Replace(' ', '+')}&lastId={lastRecipeFromCurrentPage.Id}&pageSize={currentRequestQuery.Paging.PageSize}");
    
    return new Uri(stringBuilder.ToString());
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