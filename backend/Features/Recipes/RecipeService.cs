using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal class RecipeService(IRecipeRepository recipeRepository) : IRecipeService
{
  public async Task<List<Recipe>> GetAll()
    => await recipeRepository.GetAll();

  public async Task<Maybe<RecipeDetails>> GetById(int id) 
    => await recipeRepository.GetById(id);
}