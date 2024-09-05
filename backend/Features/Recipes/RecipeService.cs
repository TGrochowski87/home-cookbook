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
    var createdTags = await tagService.CreateMany(data.NewTags);
    var associatedTags = data.TagIds.Concat(createdTags).ToList();
    data = data with { TagIds = associatedTags, Description = _sanitizer.Sanitize(data.Description) };

    var recipeId = await recipeRepository.Create(data);

    if (data.Image.HasValue == false)
    {
      return recipeId;
    }

    var imageName = await imageService.Save(data.Image.Value, $"recipe-{recipeId}");
    var imageSrc = $"http://192.168.0.164:5212/recipes/images/{imageName}"; // TODO
    var setImageSourceResult = await recipeRepository.SetImageSource(recipeId, imageSrc);

    return setImageSourceResult.IsFailure ? setImageSourceResult.Error : recipeId;
  }

  public async Task<List<RecipeGet>> GetAll()
    => await recipeRepository.GetAll();

  public async Task<Maybe<RecipeDetailsGet>> GetById(int id) 
    => await recipeRepository.GetById(id);
}