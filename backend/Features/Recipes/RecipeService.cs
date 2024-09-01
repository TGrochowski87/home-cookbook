using Cookbook.Features.Images;
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

    if (data.Image.HasValue == false)
    {
      return recipeId;
    }

    var imageName = await imageService.Save(data.Image.Value, $"recipe-{recipeId}");
    var setImageSourceResult = await recipeRepository.SetImageSource(recipeId, imageName);

    return setImageSourceResult.IsFailure ? setImageSourceResult.Error : recipeId;
  }

  public async Task<List<RecipeGet>> GetAll()
    => await recipeRepository.GetAll();

  public async Task<Maybe<RecipeDetailsGet>> GetById(int id) 
    => await recipeRepository.GetById(id);
}