using Cookbook.Contracts.Categories;
using Cookbook.Contracts.Common;
using Cookbook.Contracts.Recipes;
using Cookbook.Contracts.ShoppingLists;
using Cookbook.Contracts.Tags;
using Cookbook.Features.Categories;
using Cookbook.Features.Common;
using Cookbook.Features.Recipes;
using Cookbook.Features.ShoppingLists;
using Cookbook.Features.Tags;

namespace Cookbook.Mappers;

internal static class EndpointModelMapper
{
  public static CategoryGetDto Map(Category domainModel)
    => new(domainModel.Id, domainModel.Name, domainModel.Color);

  public static List<CategoryGetDto> Map(IEnumerable<Category> domainModels)
    => domainModels.Select(Map).ToList();

  public static TagGetDto Map(Tag domainModel)
    => new(domainModel.Id, domainModel.Name);

  public static List<TagGetDto> Map(IEnumerable<Tag> domainModels)
    => domainModels.Select(Map).ToList();

  public static RecipeGetDto Map(Recipe domainModel)
    => new(
      domainModel.Id,
      domainModel.Name,
      Map(domainModel.Category),
      Map(domainModel.Tags),
      domainModel.ImageSrc.GetValueOrDefault());

  public static List<RecipeGetDto> Map(IEnumerable<Recipe> domainModels)
    => domainModels.Select(Map).ToList();

  public static ShoppingListGetDto Map(ShoppingList domainModel)
    => new(domainModel.Id, domainModel.Name, domainModel.CreationDate, domainModel.UpdateDate);

  public static List<ShoppingListGetDto> Map(IEnumerable<ShoppingList> domainModels)
    => domainModels.Select(Map).ToList();

  public static AmountGetDto Map(Amount domainModel)
    => new(domainModel.Value, domainModel.Unit.GetValueOrDefault());

  public static QuantifiableItemGetDto Map(QuantifiableItem domainModel) 
    => new(
      domainModel.Id, 
      domainModel.Name,
    Map(domainModel.Amount), 
      domainModel.Checked);
  
  public static List<QuantifiableItemGetDto> Map(IEnumerable<QuantifiableItem> domainModels) 
    => domainModels.Select(Map).ToList();

  public static RecipeDetailsGetDto Map(RecipeDetails domainModel)
    => new(
      domainModel.Id,
      domainModel.Name,
      Map(domainModel.Category),
      Map(domainModel.Tags),
      domainModel.ImageSrc.GetValueOrDefault(),
      domainModel.Description,
      Map(domainModel.Ingredients));
}