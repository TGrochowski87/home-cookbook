using Cookbook.Features.Common.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists;

internal record ShoppingListUpdate(string Name, List<ShoppingSublistUpdate> Sublists);

internal record ShoppingSublistUpdate(int Id, decimal Count, List<ShoppingListItemUpdate> Items);

internal record ShoppingListItemUpdate(Maybe<int?> Id, string Name, Amount Amount, bool Checked);