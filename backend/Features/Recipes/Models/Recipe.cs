using Cookbook.Features.Categories;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

internal record Recipe(int Id, string Name, Category Category, List<Tag> Tags, Maybe<string?> ImageSrc);