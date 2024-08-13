using Cookbook.DataAccess;
using Cookbook.Mappers;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.Recipes;

internal class RecipeRepository(CookbookContext context) : IRecipeRepository
{
  public async Task<List<Recipe>> GetAll()
  {
    // TODO: Pagination
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

  public async Task<Maybe<RecipeDetails>> GetById(int id)
  {
    var entity = await context.Recipes
      .Include(r => r.Category)
      .Include(r =>r.Tags)
      .Include(r => r.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(r => r.Id == id);
    
    return entity is not null ? RepositoryModelMapper.Map(entity) : Maybe<RecipeDetails>.None;
  }
}