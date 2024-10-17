using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeRepository
{
  Task<(List<RecipeGet> recipes, bool isLastPage)> GetMany(Maybe<string> lastName, Maybe<int?> lastId, int pageSize);
  
  Task<Result<RecipeDetailsGet, Error>> GetById(int id);

  Task<int> Create(RecipeCreate data);

  Task<UnitResult<Error>> Update(int id, RecipeCreate data);

  Task<UnitResult<Error>> SetImageSource(int recipeId, string imageSrc);
}