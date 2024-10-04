using Cookbook.Features.Common;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.ShoppingLists.Update;

internal record ListItemStateUpdate(Maybe<string> Name, Maybe<Amount> Amount, Maybe<bool> Checked);