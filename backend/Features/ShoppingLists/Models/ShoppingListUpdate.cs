using Cookbook.Features.Common.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists.Models;

internal record ShoppingListUpdate(string Name, bool AutoDelete, List<ShoppingSublistUpdate> Sublists);

internal record ShoppingSublistUpdate(int Id, decimal Count, List<ShoppingListItemUpdate> Items);

internal record ShoppingListItemUpdate(Maybe<int?> Id, string Name, Amount Amount, bool Checked);