using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeService
{
  Task<List<RecipeGet>> GetAll();
  
  Task<Result<RecipeDetailsGet, Error>> GetById(int id);

  Task<Result<int, Error>> Create(RecipeCreate data);

  Task<UnitResult<Error>> Update(int id, RecipeCreate data);
}