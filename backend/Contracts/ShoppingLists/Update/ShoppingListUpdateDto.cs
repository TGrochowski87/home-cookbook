namespace Cookbook.Contracts.ShoppingLists.Update;

public record ShoppingListUpdateDto(string? Name, List<ShoppingSublistUpdateDto>? Sublists);