using Cookbook.Contracts.Common;

namespace Cookbook.Contracts.ShoppingLists.Update;

public record ShoppingListUpdateDto(string Name, List<ShoppingSublistUpdateDto> Sublists);

public record ShoppingSublistUpdateDto(int Id, int Count, List<ShoppingListItemUpdateDto> Items);

public record ShoppingListItemUpdateDto(int? Id, string Name, AmountDto Amount, bool Checked);