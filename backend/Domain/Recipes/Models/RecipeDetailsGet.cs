using Cookbook.Domain.Categories.Models;
using Cookbook.Domain.Common.Models;
using Cookbook.Domain.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Recipes.Models;

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