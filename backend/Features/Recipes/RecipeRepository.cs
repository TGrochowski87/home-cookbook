using Cookbook.DataAccess;
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
    await context.SaveChangesAsync();

    // TODO: Is this efficient? Is this how it should be done?
    var tags = context.Tags.Where(t => data.TagIds.Contains(t.Id)).ToList();

    // TODO: Possible to use mapper?
    var newRecipe = new Recipe
    {
      Name = data.Name,
      CategoryId = data.CategoryId,
      ListId = list.Id,
      Description = data.Description,
      Tags = tags,
      Creationdate = DateTime.Now,
      Updatedate = DateTime.Now
    };

    context.Recipes.Add(newRecipe);
    await context.SaveChangesAsync();

    return newRecipe.Id;
  }

  public async Task<UnitResult<Error>> Update(int id, RecipeCreate data)
  {
    var recipe = await context.Recipes
      .Include(r => r.Tags)
      .Include(r => r.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(r => r.Id == id);
    if(recipe == null)
    {
      return new Error(HttpStatusCode.NotFound, "Przepis o podanym ID nie istnieje.");
    }
    
    recipe.Name = data.Name;
    recipe.CategoryId = data.CategoryId;
    recipe.Description = data.Description;
    
    recipe.Tags.Clear();
    recipe.Tags = context.Tags.Where(t => data.TagIds.Contains(t.Id)).ToList();
    
    recipe.List.QuantifiableItems.Clear();
    var listItems = RepositoryModelMapper.Map(data.Ingredients);
    foreach (var item in listItems)
    {
      recipe.List.QuantifiableItems.Add(item);
    }
    
    recipe.Updatedate = DateTime.Now;
    await context.SaveChangesAsync();
    return UnitResult.Success<Error>();
  }

  public async Task<(List<RecipeGet> recipes, bool isLastPage)> GetMany(
    Maybe<string> lastName, 
    Maybe<int?> lastId, 
    int pageSize)
  {
    var lastNameValue = lastName.Or(string.Empty).Value;
    var lastIdValue = lastId.Or(0).Value;
    
    // TODO: Test all complex queries for possible performance issues.
    var entities = await context.Recipes
      .OrderBy(r => r.Name)
      .ThenBy(r => r.Id)
      .Where(r => r.Name.CompareTo(lastNameValue) > 0 || (r.Name.CompareTo(lastNameValue) == 0 && r.Id > lastIdValue))
      .Take(pageSize)
      .Select(r => new { r.Id, r.Name, r.Category, r.Tags, r.ImageSrc })
      .ToListAsync();

    var lastRecipe = await context.Recipes
      .OrderBy(r => r.Name)
      .ThenBy(r => r.Id)
      .LastOrDefaultAsync();
    
    
    var isLastPage = lastRecipe is not null && entities.Last().Id == lastRecipe.Id;
    var recipes = entities
      .Select(e
        => new RecipeGet(
          e.Id,
          e.Name,
          RepositoryModelMapper.Map(e.Category),
          RepositoryModelMapper.Map(e.Tags),
          e.ImageSrc!))
      .ToList();

    return (recipes, isLastPage);
  }

  public async Task<Result<RecipeDetailsGet, Error>> GetById(int id)
  {
    var entity = await context.Recipes
      .Include(r => r.Category)
      .Include(r =>r.Tags)
      .Include(r => r.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(r => r.Id == id);
    
    return entity is not null 
      ? RepositoryModelMapper.Map(entity) 
      : new Error(HttpStatusCode.NotFound, "Przepis o podanym ID nie istnieje.");
  }

  public async Task<UnitResult<Error>> SetImageSource(int recipeId, string imageSrc)
  {
    var recipe = await context.Recipes.SingleOrDefaultAsync(r => r.Id == recipeId);
    if(recipe == null)
    {
      return new Error(HttpStatusCode.NotFound, "Przepis o podanym ID nie istnieje.");
    }

    recipe.ImageSrc = imageSrc;
    await context.SaveChangesAsync();
    return UnitResult.Success<Error>();
  }
}