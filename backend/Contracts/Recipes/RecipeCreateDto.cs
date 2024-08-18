using Cookbook.Contracts.Common;
using Cookbook.Contracts.Tags;

namespace Cookbook.Contracts.Recipes;

public record RecipeCreateDto(
  string Name, 
  int CategoryId, 
  string Description,
  List<int> TagIds, 
  List<TagCreateDto> NewTags,
  IFormFile? Image,
  List<QuantifiableItemCreateDto> Ingredients);
