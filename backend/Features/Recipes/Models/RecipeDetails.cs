using Cookbook.Features.Categories;
using Cookbook.Features.Common;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal record RecipeDetails(
  int Id, 
  string Name, 
  Category Category, 
  List<Tag> Tags, 
  Maybe<string?> ImageSrc, 
  string Description, 
  List<QuantifiableItem> Ingredients) 
  : Recipe(Id, Name, Category, Tags, ImageSrc);