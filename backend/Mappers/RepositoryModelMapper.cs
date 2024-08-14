using Cookbook.DataAccess;
using Cookbook.Features.Common;
using Cookbook.Features.Recipes;
using Cookbook.Features.ShoppingLists;
using CSharpFunctionalExtensions;
using Category = Cookbook.Features.Categories.Category;
using QuantifiableItem = Cookbook.Features.Common.QuantifiableItem;
using Recipe = Cookbook.DataAccess.Recipe;
using ShoppingList = Cookbook.Features.ShoppingLists.ShoppingList;
using ShoppingSublist = Cookbook.Features.ShoppingLists.ShoppingSublist;
using Tag = Cookbook.Features.Tags.Tag;

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
    
  public static ShoppingSublist Map(DataAccess.ShoppingSublist entity) 
    => new(
      entity.Id, 
      entity.Recipe != null ? entity.Recipe.Name : "Manualnie dodane",
      entity.Recipe != null ? entity.Recipe.Id : Maybe<int>.None,
      entity.Count,
      Map(entity.List.QuantifiableItems));
  
  public static List<ShoppingSublist> Map(IEnumerable<DataAccess.ShoppingSublist> entities) 
    => entities.Select(Map).ToList();

  public static ShoppingListDetails Map<T>(DataAccess.ShoppingList entity) where T : ShoppingListDetails
    => new(entity.Id, entity.Name, entity.Creationdate, entity.Updatedate, Map(entity.ShoppingSublists));
}