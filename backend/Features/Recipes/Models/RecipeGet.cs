using Cookbook.Features.Categories.Models;
using Cookbook.Features.Tags.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes.Models;

internal record RecipeGet(int Id, string Name, Category Category, List<TagGet> Tags, Maybe<string> ImageSrc);