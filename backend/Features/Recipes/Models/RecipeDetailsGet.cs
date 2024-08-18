using Cookbook.Features.Categories;
using Cookbook.Features.Common;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal record RecipeDetailsGet(
  int Id, 
  string Name, 
  Category Category, 
  List<TagGet> Tags, 
  Maybe<string?> ImageSrc, 
  string Description, 
  List<QuantifiableItemGet> Ingredients) 
  : RecipeGet(Id, Name, Category, Tags, ImageSrc);