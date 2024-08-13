using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeService
{
  Task<List<Recipe>> GetAll();
  
  Task<Maybe<RecipeDetails>> GetById(int id);  
}