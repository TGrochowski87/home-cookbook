using Cookbook.Features.Images;
using Cookbook.Features.Recipes.Models;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal class RecipeService(IRecipeRepository recipeRepository, ITagService tagService, IImageService imageService) 
  : IRecipeService
{
  public async Task<Result<int, Error>> Create(RecipeCreate data)
  {
    var createdTags = await Task.WhenAll(data.NewTags.Select(
      async tag => await tagService.Create(tag)));
    var associatedTags = data.TagIds.Concat(createdTags).ToList();
    data = data with { TagIds = associatedTags };

    var recipeId = await recipeRepository.Create(data);

    // TODO: Unexpected error handling. Transaction should be rolled back on failure.
    if (data.Image.HasValue)
    {
      var imageName = await imageService.Save(data.Image.Value, $"recipe-{recipeId}");
      var setImageSourceResult = await recipeRepository.SetImageSource(recipeId, imageName);
      if(setImageSourceResult.HasValue)
      {
        return setImageSourceResult.Value;
      }
    }

    return recipeId;
  }

  public async Task<List<RecipeGet>> GetAll()
    => await recipeRepository.GetAll();

  public async Task<Maybe<RecipeDetailsGet>> GetById(int id) 
    => await recipeRepository.GetById(id);
}