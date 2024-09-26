using Cookbook.Contracts.Common;

namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingSublistGetDto(int Id, string Name, int? RecipeId, decimal Count, List<QuantifiableItemGetDto> Items);