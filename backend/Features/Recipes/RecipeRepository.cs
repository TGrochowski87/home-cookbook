using Cookbook.DataAccess;
using Cookbook.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.Recipes;

internal class RecipeRepository(CookbookContext context) : IRecipeRepository
{
  public async Task<List<Recipe>> GetAll()
  {
    // TODO: Test all complex queries for possible performance issues.
    var entities = await context.Recipes
      .Select(r => new { r.Id, r.Name, r.Category, r.Tags, r.ImageSrc })
      .ToListAsync();

    return entities
      .Select(e
        => new Recipe(
          e.Id,
          e.Name,
          RepositoryModelMapper.Map(e.Category),
          RepositoryModelMapper.Map(e.Tags),
          e.ImageSrc!))
      .ToList();
  }
}