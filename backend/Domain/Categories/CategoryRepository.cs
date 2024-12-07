using Cookbook.DataAccess;
using Cookbook.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Domain.Categories;

internal class CategoryRepository(CookbookContext context) : ICategoryRepository
{
  public async Task<List<Category>> GetAll()
  {
    var entities = await context.Categories.AsNoTracking().ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }
}