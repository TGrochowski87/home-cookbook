using Cookbook.Features.Common;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal record Sublist(int Id, Maybe<string> Name, Maybe<int> RecipeId, int Count, List<QuantifiableItem> Items);