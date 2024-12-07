using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Recipes;

internal interface IRecipeRepository
{
  Task<(List<RecipeGet> recipes, bool isLastPage)> GetMany(GetRecipesQueryParams queryParams);
  
  Task<Result<RecipeDetailsGet, Error>> GetById(int id);

  Task<int> Create(RecipeCreate data);

  Task<UnitResult<Error>> Update(int id, RecipeCreate data);

  Task<UnitResult<Error>> SetImageSource(int recipeId, string imageSrc);
}