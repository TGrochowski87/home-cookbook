using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Recipes;

internal interface IRecipeService
{
  Task<(List<RecipeGet> recipes, bool isLastPage)> GetMany(GetRecipesQueryParams queryParams);
  
  Task<Result<RecipeDetailsGet, Error>> GetById(int id);

  Task<Result<RecipeDetailsGet, Error>> Create(RecipeCreate data);

  Task<Result<RecipeDetailsGet, Error>> Update(int id, DateTime resourceStateTimestampFromRequest, RecipeCreate data);
}