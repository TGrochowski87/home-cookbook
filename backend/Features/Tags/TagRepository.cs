using Cookbook.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.Tags;

internal class TagRepository(CookbookContext context) : ITagRepository
{
  public async Task<List<Tag>> GetAll()
  {
    var entities = await context.Tags.ToListAsync();
    return entities.Select(e => new Tag(e.Id, e.Name)).ToList();
  }
}