using Cookbook.Domain.Common.Models;
using Cookbook.Domain.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Recipes;

internal record RecipeCreate(
  string Name,
  int CategoryId,
  List<int> TagIds,
  List<TagCreate> NewTags,
  Maybe<IFormFile> Image,
  string Description,
  List<QuantifiableItemCreate> Ingredients);
