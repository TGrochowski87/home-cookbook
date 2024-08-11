using Cookbook.Contracts.Categories;
using Cookbook.Contracts.Recipes;
using Cookbook.Contracts.Tags;
using Cookbook.Features.Categories;
using Cookbook.Features.Recipes;
using Cookbook.Features.Tags;

namespace Cookbook.Mappers;

internal static class EndpointModelMapper
{
  public static CategoryGetDto Map(Category domainModel) 
    => new(domainModel.Id, domainModel.Name, domainModel.Color);
  
  public static List<CategoryGetDto> Map(IEnumerable<Category> entities)
    => entities.Select(Map).ToList();
  
  public static TagGetDto Map(Tag domainModel) 
    => new(domainModel.Id, domainModel.Name);
  
  public static List<TagGetDto> Map(IEnumerable<Tag> entities)
    => entities.Select(Map).ToList();
  
  public static RecipeGetDto Map(Recipe entity) 
    => new(entity.Id, entity.Name, Map(entity.Category), Map(entity.Tags), entity.ImageSrc.GetValueOrDefault());
  
  public static List<RecipeGetDto> Map(IEnumerable<Recipe> entities)
    => entities.Select(Map).ToList();
}