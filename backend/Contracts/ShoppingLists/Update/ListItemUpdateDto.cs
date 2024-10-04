namespace Cookbook.Contracts.ShoppingLists.Update;

public record ListItemUpdateDto(int? Id, ListItemStateUpdateDto? State);