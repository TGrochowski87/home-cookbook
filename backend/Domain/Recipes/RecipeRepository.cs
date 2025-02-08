using System.Net;
using Cookbook.DataAccess;
using Cookbook.Domain.Recipes.Models;
using Cookbook.Mappers;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Domain.Recipes;

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

    var tags = context.Tags.Where(t => data.TagIds.Contains(t.Id)).ToList();

    var newRecipe = new Recipe
    {
      Name = data.Name,
      CategoryId = data.CategoryId,
      ListId = list.Id,
      Description = data.Description,
      Tags = tags,
      Creationdate = DateTime.UtcNow,
      Updatedate = DateTime.UtcNow
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
    if (recipe == null)
    {
      return new Error(HttpStatusCode.NotFound, $"The recipe of ID = {id} does not exist.");
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

    recipe.Updatedate = DateTime.UtcNow;
    await context.SaveChangesAsync();
    return UnitResult.Success<Error>();
  }

  public async Task<(List<RecipeGet> recipes, bool isLastPage)> GetMany(GetRecipesQueryParams queryParams)
  {
    IQueryable<Recipe> query = context.Recipes
      .Include(r => r.Category)
      .Include(r => r.Tags)
      .OrderBy(r => r.Name)
      .ThenBy(r => r.Id);

    ApplyFiltering(ref query, queryParams);
    ApplyPaging(ref query, queryParams);
    
    var entities = await query
      .Select(r => new { r.Id, r.Name, r.Category, r.Tags, r.ImageSrc })
      .AsNoTracking()
      .ToListAsync();

    // If the last row is in this page or the page is empty, there are no more pages.
    var lastRecipe = await context.Recipes
      .OrderBy(r => r.Name)
      .ThenBy(r => r.Id)
      .LastOrDefaultAsync();
    var isLastPage = entities.Count == 0 || (lastRecipe is not null && entities.Last().Id == lastRecipe.Id);
    
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
    // TODO: Check queries for cartesian explosion
    var entity = await context.Recipes
      .Include(r => r.Category)
      .Include(r => r.Tags)
      .Include(r => r.List)
      .ThenInclude(l => l.QuantifiableItems)
      .SingleOrDefaultAsync(r => r.Id == id);

    return entity is not null
      ? RepositoryModelMapper.Map(entity)
      : new Error(HttpStatusCode.NotFound, $"The recipe of ID = {id} does not exist.");
  }

  public async Task<UnitResult<Error>> SetImageSource(int recipeId, string imageSrc)
  {
    var recipe = await context.Recipes.SingleOrDefaultAsync(r => r.Id == recipeId);
    if (recipe == null)
    {
      return new Error(HttpStatusCode.NotFound, $"The recipe of ID = {recipeId} does not exist.");
    }

    recipe.ImageSrc = imageSrc;
    await context.SaveChangesAsync();
    return UnitResult.Success<Error>();
  }

  public async Task<UnitResult<Error>> RemoveImageSource(int recipeId)
  {
    var recipe = await context.Recipes.SingleOrDefaultAsync(r => r.Id == recipeId);
    if (recipe == null)
    {
      return new Error(HttpStatusCode.NotFound, $"The recipe of ID = {recipeId} does not exist.");
    }

    recipe.ImageSrc = null;
    await context.SaveChangesAsync();
    return UnitResult.Success<Error>();
  }

  private static void ApplyFiltering(ref IQueryable<Recipe> query, GetRecipesQueryParams queryParams)
  {
    if (!queryParams.Filtering.HasValue)
    {
      return;
    }

    if (queryParams.Filtering.Value.Name.HasValue)
    {
      query = query.Where(r => r.Name.Contains(queryParams.Filtering.Value.Name.Value));
    }
    if (queryParams.Filtering.Value.Category.HasValue)
    {
      query = query.Where(r => r.Category.Name == queryParams.Filtering.Value.Category.Value);
    }
    if (queryParams.Filtering.Value.Tags.Length > 0)
    {
      query = query.Where(r => r.Tags
        .Select(t => t.Name)
        .Intersect(queryParams.Filtering.Value.Tags)
        .Count() == queryParams.Filtering.Value.Tags.Length);
    }
  }

  /// <summary>
  /// 'Keyset pagination' is used. It is better for infinite scrolling than 'offset pagination', because the latter has
  /// to process all previous records before it can select the last bunch for a page. Here, the pagination is done
  /// thought the 'where' clause which is very efficient if indexes are in place, as the first row is easily discoverable
  /// and the record are already sorted.
  ///
  /// For multiple pagination keys a composite index must be in place.
  ///
  /// 'Keyset pagination' does not support random page access and it needs to know the previous records, but it is not
  /// possible in 'infinite scrolling'.
  /// </summary>
  private static void ApplyPaging(ref IQueryable<Recipe> query, GetRecipesQueryParams queryParams)
  {
    query = query.Where(r => r.Name.CompareTo(queryParams.Paging.LastName) > 0 || 
                             (r.Name.CompareTo(queryParams.Paging.LastName) == 0 && 
                              r.Id > queryParams.Paging.LastId))
      .Take(queryParams.Paging.PageSize);
  }
}