using Cookbook.DataAccess;
using Cookbook.Features.Recipes.Models;
using Cookbook.Mappers;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Cookbook.Features.Recipes;

internal class RecipeRepository(CookbookContext context) : IRecipeRepository
{
  public async Task<int> Create(RecipeCreate data)
  {
    var list = new List
    {
      QuantifiableItems = RepositoryModelMapper.Map(data.Ingredients)
    };
    context.Lists.Add(list);

    var tags = data.TagIds.Select(id => new Tag {Id = id }).ToList();

    // TODO: Possible to use mapper?
    var newRecipe = new Recipe
    {
      Name = data.Name,
      CategoryId = data.CategoryId,
      ListId = list.Id,
      Description = data.Description,
      Tags = tags
    };

    context.Recipes.Add(newRecipe);
    await context.SaveChangesAsync();

    return newRecipe.Id;
  }

  public async Task<List<RecipeGet>> GetAll()
  {
    // TODO: Pagination
    // TODO: Test all complex queries for possible performance issues.
    var entities = await context.Recipes
      .Select(r => new { r.Id, r.Name, r.Category, r.Tags, r.ImageSrc })
      .ToListAsync();

    return entities
      .Select(e
        => new RecipeGet(
          e.Id,
          e.Name,
          RepositoryModelMapper.Map(e.Category),
          RepositoryModelMapper.Map(e.Tags),
          e.ImageSrc!))
      .ToList();
  }

  public async Task<Maybe<RecipeDetailsGet>> GetById(int id)
  {
    var entity = await context.Recipes
      .Include(r => r.Category)
      .Include(r =>r.Tags)
      .Include(r => r.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(r => r.Id == id);
    
    return entity is not null ? RepositoryModelMapper.Map(entity) : Maybe<RecipeDetailsGet>.None;
  }

  public async Task<Maybe<Error>> SetImageSource(int recipeId, string imageSrc)
  {
    var recipe = await context.Recipes.SingleOrDefaultAsync(r => r.Id == recipeId);
    if(recipe == null)
    {
      return new Error(HttpStatusCode.NotFound, "Przepis o podanym ID nie istnieje");
    }

    recipe.ImageSrc = imageSrc;
    await context.SaveChangesAsync();
    return Maybe<Error>.None;
  }
}