namespace Cookbook.Contracts.Recipes;

public record GetRecipesResponseDto(Uri? NextPage, List<RecipeGetDto> Recipes);