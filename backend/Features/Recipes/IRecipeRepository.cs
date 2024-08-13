using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeRepository
{
  Task<List<Recipe>> GetAll();
  
  Task<Maybe<RecipeDetails>> GetById(int id);  
}