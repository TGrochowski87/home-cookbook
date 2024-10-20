using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeService
{
  Task<(List<RecipeGet> recipes, bool isLastPage)> GetMany(GetRecipesQueryParams queryParams);
  
  Task<Result<RecipeDetailsGet, Error>> GetById(int id);

  Task<Result<int, Error>> Create(RecipeCreate data);

  Task<UnitResult<Error>> Update(int id, DateTime resourceStateTimestampFromRequest, RecipeCreate data);
}