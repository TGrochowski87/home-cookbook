using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeService
{
  Task<List<RecipeGet>> GetAll();
  
  Task<Maybe<RecipeDetailsGet>> GetById(int id);

  Task<Result<int, Error>> Create(RecipeCreate data);
}