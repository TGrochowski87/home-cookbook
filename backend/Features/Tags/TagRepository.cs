using Cookbook.DataAccess;
using Cookbook.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.Tags;

internal class TagRepository(CookbookContext context) : ITagRepository
{
  public async Task<int> Create(TagCreate data)
  {
    var tag = new Tag
    {
      Name = data.Name,
    };

    // TODO: Handle unique constraint violation
    context.Tags.Add(tag);
    await context.SaveChangesAsync();

    return tag.Id;
  }

  public async Task<List<TagGet>> GetAll()
  {
    var entities = await context.Tags.ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }
}