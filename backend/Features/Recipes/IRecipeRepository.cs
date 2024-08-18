using Cookbook.Features.Recipes.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal interface IRecipeRepository
{
  Task<List<RecipeGet>> GetAll();
  
  Task<Maybe<RecipeDetailsGet>> GetById(int id);

  Task<int> Create(RecipeCreate data);

  Task<Maybe<Error>> SetImageSource(int recipeId, string imageSrc);
}