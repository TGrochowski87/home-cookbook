using Cookbook.Extensions;
using Cookbook.Features.Common;
using Cookbook.Features.Images;
using Cookbook.Features.Recipes.Models;
using Cookbook.Features.Recipes.Repository;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;
using Ganss.Xss;

namespace Cookbook.Features.Recipes;

internal class RecipeService : IRecipeService
{
  private readonly IRecipeRepository _recipeRepository;
  private readonly ITagService _tagService;
  private readonly IImageService _imageService;

  private readonly HtmlSanitizer _sanitizer;
  private readonly ILogger<RecipeService> _logger;

  public RecipeService(IRecipeRepository recipeRepository, ITagService tagService, IImageService imageService, ILogger<RecipeService> logger)
  {
    _recipeRepository = recipeRepository;
    _tagService = tagService;
    _imageService = imageService;

    _sanitizer = new HtmlSanitizer
    {
      AllowDataAttributes = true // TipTap uses data attributes.
    };
    _sanitizer.AllowedAttributes.Add("class");

    _logger = logger;
  }

  public async Task<Result<RecipeDetailsGet, Error>> Create(RecipeCreate data)
  {
    return await _tagService.CreateMany(data.NewTags)
      .Tap(newTagIds => _logger.LogInformation("Created new tags with IDs: {newTagIds}", string.Join(", ", newTagIds)))
      .Map(newTagIds => data with
      {
        TagIds = newTagIds.Concat(data.TagIds).ToList(),
        Description = _sanitizer.Sanitize(data.Description)
      })
      .Bind(updateData => _recipeRepository.Create(updateData).ToResultAsync<int, Error>())
      .CheckIf(data.Image.HasValue, recipeId => SaveRecipeImage(recipeId, data.Image.Value))
      .Bind(recipeId => _recipeRepository.GetById(recipeId));
  }

  public async Task<Result<RecipeDetailsGet,Error>> Update(int id, DateTime resourceStateTimestampFromRequest, RecipeCreate data)
  {
    return await _recipeRepository.GetById(id)
      .Tap(recipe => _logger.LogInformation("Update date passed: {PassedUpdateDate}\nUpdate date from DB: {DBUpdateDate}", 
        resourceStateTimestampFromRequest, recipe.UpdateDate))
      .Check(recipe =>
        CommonResourceValidator.VerifyResourceStateNotOutdated(resourceStateTimestampFromRequest, recipe.UpdateDate))
      .Bind(_ => _tagService.CreateMany(data.NewTags))
      .Tap(newTagIds => _logger.LogInformation("Created new tags with IDs: {newTagIds}", string.Join(", ", newTagIds)))
      .Map(newTagIds => data with
      {
        TagIds = newTagIds.Concat(data.TagIds).ToList(),
        Description = _sanitizer.Sanitize(data.Description)
      })
      .Bind(updateData => _recipeRepository.Update(id, updateData))
      .Tap(() => data.Image.HasValue ? SaveRecipeImage(id, data.Image.Value) : DeleteRecipeImage(id))
      .Bind(() => _recipeRepository.GetById(id));
  }

  public async Task<(List<RecipeGet> recipes, bool isLastPage)> GetMany(GetRecipesQueryParams queryParams) 
    => await _recipeRepository.GetMany(queryParams);

  public async Task<Result<RecipeDetailsGet, Error>> GetById(int id)
    => await _recipeRepository.GetById(id);

  private async Task<UnitResult<Error>> SaveRecipeImage(int recipeId, IFormFile image)
  {
    _logger.LogInformation("Saving image for recipe of ID = {RecipeId}", recipeId);
    var imageName = await _imageService.Save(image, $"recipe-{recipeId}");
    var imageSrc = $"/recipes/images/{imageName}";
    return await _recipeRepository.SetImageSource(recipeId, imageSrc);
  }

  private async Task<UnitResult<Error>> DeleteRecipeImage(int recipeId)
  {
    _logger.LogInformation("Deleting image for recipe of ID = {RecipeId}", recipeId);
    _imageService.Delete($"recipe-{recipeId}");
    return await _recipeRepository.RemoveImageSource(recipeId);
  }
}