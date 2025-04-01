using Cookbook.Features.Categories.Models;
using Cookbook.Features.Common.Models;
using Cookbook.Features.Tags.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes.Models;

internal record RecipeDetailsGet(
  int Id, 
  string Name, 
  Category Category, 
  List<TagGet> Tags, 
  Maybe<string> ImageSrc, 
  string Description, 
  List<QuantifiableItemGet> Ingredients, 
  DateTime CreationDate, 
  DateTime UpdateDate) 
  : RecipeGet(Id, Name, Category, Tags, ImageSrc);