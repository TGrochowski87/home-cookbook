using Cookbook.Contracts.Categories;
using Cookbook.Contracts.Common;
using Cookbook.Contracts.Recipes;
using Cookbook.Contracts.ShoppingLists;
using Cookbook.Contracts.Tags;
using Cookbook.Features.Common;
using Cookbook.Features.Recipes;
using Cookbook.Features.ShoppingLists;
using Category = Cookbook.Features.Categories.Category;
using QuantifiableItem = Cookbook.Features.Common.QuantifiableItem;
using Recipe = Cookbook.Features.Recipes.Recipe;
using ShoppingList = Cookbook.Features.ShoppingLists.ShoppingList;
using Tag = Cookbook.Features.Tags.Tag;

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
  
  public static ShoppingSublistGetDto Map(ShoppingSublist domainModel) => 
    new(domainModel.Id, domainModel.Name, domainModel.RecipeId.GetValueOrDefault(), domainModel.Count, Map(domainModel.Items));
  
  public static List<ShoppingSublistGetDto> Map(IEnumerable<ShoppingSublist> domainModels) 
    => domainModels.Select(Map).ToList();

  public static ShoppingListDetailsGetDto Map(ShoppingListDetails domainModel) => new(domainModel.Id, domainModel.Name,
    domainModel.CreationDate, domainModel.UpdateDate, Map(domainModel.Sublists));
}