using Cookbook.Contracts.Categories;
using Cookbook.Contracts.Tags;

namespace Cookbook.Contracts.Recipes;

public record RecipeGetDto(int Id, string Name, CategoryGetDto Category, List<TagGetDto> Tags, string? ImageSrc);