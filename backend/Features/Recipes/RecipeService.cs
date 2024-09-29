using Cookbook.Extensions;
using Cookbook.Features.Images;
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

  public RecipeService(IRecipeRepository recipeRepository, ITagService tagService, IImageService imageService)
  {
    _recipeRepository = recipeRepository;
    _tagService = tagService;
    _imageService = imageService;
    
    _sanitizer = new HtmlSanitizer
    {
      AllowDataAttributes = true // TipTap uses data attributes.
    };
    _sanitizer.AllowedAttributes.Add("class");
  }

  public async Task<Result<int, Error>> Create(RecipeCreate data)
  {
    return await _tagService.CreateMany(data.NewTags)
      .ToResultAsync<List<int>, Error>()
      .Map(newTagIds => data with
      {
        TagIds = newTagIds.Concat(data.TagIds).ToList(), 
        Description = _sanitizer.Sanitize(data.Description)
      })
      .Bind(updateData => _recipeRepository.Create(updateData).ToResultAsync<int, Error>())
      .CheckIf(data.Image.HasValue, recipeId => SaveRecipeImage(recipeId, data.Image.Value));
  }

  public async Task<UnitResult<Error>> Update(int id, RecipeCreate data)
  {
    return await _tagService.CreateMany(data.NewTags)
      .ToResultAsync<List<int>, Error>()
      .Map(newTagIds => data with
      {
        TagIds = newTagIds.Concat(data.TagIds).ToList(), 
        Description = _sanitizer.Sanitize(data.Description)
      })
      .Bind(updateData => _recipeRepository.Update(id, updateData))
      .CheckIf(data.Image.HasValue, () => SaveRecipeImage(id, data.Image.Value));
  }

  public async Task<List<RecipeGet>> GetAll()
    => await _recipeRepository.GetAll();

  public async Task<Maybe<RecipeDetailsGet>> GetById(int id) 
    => await _recipeRepository.GetById(id);

  private async Task<UnitResult<Error>> SaveRecipeImage(int recipeId, IFormFile image)
  {
    var imageName = await _imageService.Save(image, $"recipe-{recipeId}");
    var imageSrc = $"http://192.168.0.164:5212/recipes/images/{imageName}"; // TODO
    return await _recipeRepository.SetImageSource(recipeId, imageSrc);
  }
}