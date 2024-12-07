using Cookbook.Domain.Categories.Models;
using Cookbook.Domain.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Recipes.Models;

internal record RecipeGet(int Id, string Name, Category Category, List<TagGet> Tags, Maybe<string> ImageSrc);