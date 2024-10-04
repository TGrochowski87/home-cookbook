namespace Cookbook.Contracts.ShoppingLists.Update;

public record ListItemStateUpdateDto(string? Name, AmountUpdateDto? Amount, bool? Checked);