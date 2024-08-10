using Cookbook.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.Categories;

internal class CategoryRepository(CookbookContext context) : ICategoryRepository
{
    public async Task<List<Category>> GetAll()
    {
        var entities = await context.Categories.ToListAsync();
        return entities.Select(e => new Category(e.Id, e.Name, e.Color)).ToList();
    }
}