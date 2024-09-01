using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeRepository
{
  Task<List<RecipeGet>> GetAll();
  
  Task<Maybe<RecipeDetailsGet>> GetById(int id);

  Task<int> Create(RecipeCreate data);

  Task<UnitResult<Error>> SetImageSource(int recipeId, string imageSrc);
}