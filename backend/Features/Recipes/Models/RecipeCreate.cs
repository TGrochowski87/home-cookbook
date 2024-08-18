using Cookbook.Features.Categories;
using Cookbook.Features.Common;
using Cookbook.Features.Tags.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes.Models;

internal record RecipeCreate(
  string Name,
  int CategoryId,
  List<int> TagIds,
  List<TagCreate> NewTags,
  Maybe<IFormFile> Image,
  string Description,
  List<QuantifiableItemCreate> Ingredients);
