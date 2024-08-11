using Cookbook.Features.Categories;
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

  // public static Recipe Map(DataAccess.Recipe entity)
  //   => new(entity.Id, entity.Name, Map(entity.Category), Map(entity.Tags), entity.ImageSrc!);
}