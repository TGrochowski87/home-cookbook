using Cookbook.DataAccess;
using Cookbook.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.Tags;

internal class TagRepository(CookbookContext context) : ITagRepository
{
  public async Task<List<Tag>> GetAll()
  {
    var entities = await context.Tags.ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }
}