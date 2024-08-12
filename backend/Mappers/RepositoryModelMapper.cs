using Cookbook.Features.Categories;
using Cookbook.Features.ShoppingLists;
using Cookbook.Features.Tags;

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
}