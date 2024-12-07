using Cookbook.Domain.Common.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Domain.ShoppingLists.Models;

internal record ShoppingSublist(int Id, string Name, Maybe<int?> RecipeId, decimal Count, List<QuantifiableItemGet> Items);