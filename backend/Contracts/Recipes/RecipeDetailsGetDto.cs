using Cookbook.Contracts.Categories;
using Cookbook.Contracts.Common;
using Cookbook.Contracts.Tags;

namespace Cookbook.Contracts.Recipes;

public record RecipeDetailsGetDto(
  int Id, 
  string Name, 
  CategoryGetDto Category, 
  List<TagGetDto> Tags, 
  string? ImageSrc,
  string Description,
  List<QuantifiableItemGetDto> Ingredients) : RecipeGetDto(Id, Name, Category, Tags, ImageSrc);