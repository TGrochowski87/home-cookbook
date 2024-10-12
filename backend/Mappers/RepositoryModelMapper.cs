using Cookbook.DataAccess;
using Cookbook.Features.Common.Models;
using Cookbook.Features.Recipes;
using Cookbook.Features.ShoppingLists;
using Cookbook.Features.Tags;
using Category = Cookbook.Features.Categories.Category;
using QuantifiableItemGet = Cookbook.Features.Common.Models.QuantifiableItemGet;
using Recipe = Cookbook.DataAccess.Recipe;
using ShoppingList = Cookbook.Features.ShoppingLists.ShoppingList;
using ShoppingSublist = Cookbook.Features.ShoppingLists.ShoppingSublist;
using TagGet = Cookbook.Features.Tags.TagGet;

namespace Cookbook.Mappers;

internal static class RepositoryModelMapper
{
  public static Category Map(DataAccess.Category entity)
    => new(entity.Id, entity.Name, entity.Color);

  public static List<Category> Map(IEnumerable<DataAccess.Category> entities)
    => entities.Select(Map).ToList();

  public static TagGet Map(DataAccess.Tag entity)
    => new(entity.Id, entity.Name);

  public static Tag Map(TagCreate domainModel) => new() { Name = domainModel.Name };

  public static List<TagGet> Map(IEnumerable<DataAccess.Tag> entities)
    => entities.Select(Map).ToList();

  public static ShoppingList Map(DataAccess.ShoppingList entity)
    => new(entity.Id, entity.Name, entity.Creationdate, entity.Updatedate);
  
  public static List<ShoppingList> Map(IEnumerable<DataAccess.ShoppingList> entities)
    => entities.Select(Map).ToList();

  public static QuantifiableItemGet Map(DataAccess.QuantifiableItem entity)
    => new(entity.Id, entity.Name, new Amount(entity.Value, entity.Unit), entity.Checked);
  
  public static List<QuantifiableItemGet> Map(IEnumerable<DataAccess.QuantifiableItem> entities)
    => entities.Select(Map).ToList();

  public static RecipeDetailsGet Map(Recipe entity)
    => new(
      entity.Id,
      entity.Name,
      Map(entity.Category),
      Map(entity.Tags),
      entity.ImageSrc, 
      entity.Description, 
      Map(entity.List.QuantifiableItems),
      entity.Creationdate,
      entity.Updatedate);
    
  public static ShoppingSublist Map(DataAccess.ShoppingSublist entity) 
    => new(
      entity.Id, 
      entity.Recipe?.Name ?? "Manualnie dodane",
      entity.Recipe?.Id,
      entity.Count,
      Map(entity.List.QuantifiableItems));
  
  public static List<ShoppingSublist> Map(IEnumerable<DataAccess.ShoppingSublist> entities) 
    => entities.Select(Map).ToList();

  public static ShoppingListDetails Map<T>(DataAccess.ShoppingList entity) where T : ShoppingListDetails
    => new(entity.Id, entity.Name, entity.Creationdate, entity.Updatedate, Map(entity.ShoppingSublists));

  public static QuantifiableItem Map(QuantifiableItemCreate domainModel) => new()
  {
    Name = domainModel.Name,
    Value = domainModel.Amount.Value,
    Unit = domainModel.Amount.Unit.GetValueOrDefault(),
    Checked = false
  };

  public static List<QuantifiableItem> Map(IEnumerable<QuantifiableItemCreate> domainModels) 
    => domainModels.Select(Map).ToList();
}