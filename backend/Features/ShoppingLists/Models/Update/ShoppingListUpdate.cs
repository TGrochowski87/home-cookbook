using Cookbook.Features.Common;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists.Update;

internal record ShoppingListUpdate(Maybe<string> Name, Maybe<List<ShoppingSublistUpdate>> Sublists);

internal record ShoppingSublistUpdate(int Id, Maybe<ShoppingSublistStateUpdate> State);

internal record ShoppingSublistStateUpdate(Maybe<int?> Count, Maybe<List<ListItemRelatedChange>> Items);

internal abstract record ListItemRelatedChange();

internal record ListItemCreate(string Name, Amount Amount, bool Checked) : ListItemRelatedChange;

internal record ListItemDelete(int Id) : ListItemRelatedChange;

internal record ListItemUpdate(int Id, bool Checked) : ListItemRelatedChange;