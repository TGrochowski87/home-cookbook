using Cookbook.DataAccess;
using Cookbook.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Domain.Tags;

internal class TagRepository(CookbookContext context) : ITagRepository
{
  public async Task<int> Create(TagCreate tag)
  {
    var newTag = RepositoryModelMapper.Map(tag);

    // TODO: Handle unique constraint violation
    context.Tags.Add(newTag);
    await context.SaveChangesAsync();

    return newTag.Id;
  }

  public async Task<List<int>> CreateMany(List<TagCreate> tags)
  {
    var newTags = tags.Select(RepositoryModelMapper.Map).ToList();

    // TODO: Handle unique constraint violation
    context.Tags.AddRange(newTags);
    await context.SaveChangesAsync();

    return newTags.Select(t => t.Id).ToList();
  }

  public async Task<List<TagGet>> GetAll()
  {
    var entities = await context.Tags.AsNoTracking().ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }
}