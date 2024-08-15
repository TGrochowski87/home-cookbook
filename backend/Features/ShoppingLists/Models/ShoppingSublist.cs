using Cookbook.Features.Common;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal record ShoppingSublist(int Id, string Name, Maybe<int?> RecipeId, int Count, List<QuantifiableItem> Items);