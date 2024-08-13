using Cookbook.Features.Categories;
using Cookbook.Features.Common;
using Cookbook.Features.Recipes;
using Cookbook.Features.ShoppingLists;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;
using Recipe = Cookbook.DataAccess.Recipe;

namespace Cookbook.Mappers;

internal static class RepositoryModelMapper
{
  public static Category Map(DataAccess.Category entity)
    => new(entity.Id, entity.Name, entity.Color);

  public static List<Category> Map(IEnumerable<DataAccess.Category> entities)
    => entities.Select(Map).ToList();

  public static Tag Map(DataAccess.Tag entity)
    => new(entity.Id, entity.Name);

  public static List<Tag> Map(IEnumerable<DataAccess.Tag> entities)
    => entities.Select(Map).ToList();

  public static ShoppingList Map(DataAccess.ShoppingList entity)
    => new(entity.Id, entity.Name, entity.Creationdate, entity.Updatedate);
  
  public static List<ShoppingList> Map(IEnumerable<DataAccess.ShoppingList> entities)
    => entities.Select(Map).ToList();

  public static QuantifiableItem Map(DataAccess.QuantifiableItem entity)
    => new(entity.Id, entity.Name, new Amount(entity.Value, entity.Unit ?? Maybe<string>.None), entity.Checked);
  
  public static List<QuantifiableItem> Map(IEnumerable<DataAccess.QuantifiableItem> entities)
    => entities.Select(Map).ToList();

  public static RecipeDetails Map(Recipe entity)
    => new(
      entity.Id,
      entity.Name,
      Map(entity.Category),
      Map(entity.Tags),
      entity.ImageSrc ?? Maybe<string>.None, 
      entity.Description ?? "", 
      Map(entity.List.QuantifiableItems));
}