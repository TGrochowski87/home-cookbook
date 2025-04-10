﻿using Cookbook.Contracts.Common;

namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingListUpdateDto(string Name, bool AutoDelete, List<ShoppingSublistUpdateDto> Sublists);

public record ShoppingSublistUpdateDto(int Id, decimal Count, List<ShoppingListItemUpdateDto> Items);

public record ShoppingListItemUpdateDto(int? Id, string Name, AmountDto Amount, bool Checked);