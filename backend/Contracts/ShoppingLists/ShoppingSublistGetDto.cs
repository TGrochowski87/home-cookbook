using Cookbook.Contracts.Common;

namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingSublistGetDto(int Id, string Name, int? RecipeId, int Count, List<QuantifiableItemGetDto> Items);