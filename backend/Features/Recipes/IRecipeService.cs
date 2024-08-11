namespace Cookbook.Features.Recipes;

internal interface IRecipeService
{
  Task<List<Recipe>> GetAll();
}