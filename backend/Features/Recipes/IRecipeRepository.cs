namespace Cookbook.Features.Recipes;

internal interface IRecipeRepository
{
  Task<List<Recipe>> GetAll();
}