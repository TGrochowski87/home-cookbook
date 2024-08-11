namespace Cookbook.Features.Recipes;

internal class RecipeService(IRecipeRepository recipeRepository) : IRecipeService
{
  public async Task<List<Recipe>> GetAll()
    => await recipeRepository.GetAll();
}