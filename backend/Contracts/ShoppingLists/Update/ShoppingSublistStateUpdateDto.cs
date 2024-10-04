namespace Cookbook.Contracts.ShoppingLists.Update;

public record ShoppingSublistStateUpdateDto(int? Count, List<ListItemUpdateDto>? Items);