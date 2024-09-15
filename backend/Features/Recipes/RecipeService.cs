using Cookbook.Extensions;
using Cookbook.Features.Images;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;
using Ganss.Xss;

namespace Cookbook.Features.Recipes;

internal class RecipeService(IRecipeRepository recipeRepository, ITagService tagService, IImageService imageService) 
  : IRecipeService
{
  private readonly HtmlSanitizer _sanitizer = new();
    
  public async Task<Result<int, Error>> Create(RecipeCreate data)
  {
    return await tagService.CreateMany(data.NewTags)
      .ToResultAsync<List<int>, Error>()
      .Map(newTagIds => data with
      {
        TagIds = newTagIds.Concat(data.TagIds).ToList(), 
        Description = _sanitizer.Sanitize(data.Description)
      })
      .Bind(updateData => recipeRepository.Create(updateData).ToResultAsync<int, Error>())
      .CheckIf(data.Image.HasValue, recipeId => SaveRecipeImage(recipeId, data.Image.Value));
  }

  public async Task<UnitResult<Error>> Update(int id, RecipeCreate data)
  {
    return await tagService.CreateMany(data.NewTags)
      .ToResultAsync<List<int>, Error>()
      .Map(newTagIds => data with
      {
        TagIds = newTagIds.Concat(data.TagIds).ToList(), 
        Description = _sanitizer.Sanitize(data.Description)
      })
      .Bind(updateData => recipeRepository.Update(id, updateData))
      .CheckIf(data.Image.HasValue, () => SaveRecipeImage(id, data.Image.Value));
  }

  public async Task<List<RecipeGet>> GetAll()
    => await recipeRepository.GetAll();

  public async Task<Maybe<RecipeDetailsGet>> GetById(int id) 
    => await recipeRepository.GetById(id);

  private async Task<UnitResult<Error>> SaveRecipeImage(int recipeId, IFormFile image)
  {
    var imageName = await imageService.Save(image, $"recipe-{recipeId}");
    var imageSrc = $"http://192.168.0.164:5212/recipes/images/{imageName}"; // TODO
    return await recipeRepository.SetImageSource(recipeId, imageSrc);
  }
}