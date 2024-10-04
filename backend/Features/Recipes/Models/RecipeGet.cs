using Cookbook.Features.Categories;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal record RecipeGet(int Id, string Name, Category Category, List<TagGet> Tags, Maybe<string> ImageSrc);