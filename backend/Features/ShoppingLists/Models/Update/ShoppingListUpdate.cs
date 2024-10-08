using Cookbook.Features.Common;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists.Update;

internal record ShoppingListUpdate(string Name, List<ShoppingSublistUpdate> Sublists);

internal record ShoppingSublistUpdate(int Id, decimal Count, List<ShoppingListItemUpdate> Items);

internal record ShoppingListItemUpdate(Maybe<int?> Id, string Name, Amount Amount, bool Checked);