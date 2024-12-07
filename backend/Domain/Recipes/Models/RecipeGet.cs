using Cookbook.Domain.Categories;
using Cookbook.Domain.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Recipes;

internal record RecipeGet(int Id, string Name, Category Category, List<TagGet> Tags, Maybe<string> ImageSrc);