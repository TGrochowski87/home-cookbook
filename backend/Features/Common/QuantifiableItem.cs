using CSharpFunctionalExtensions;

namespace Cookbook.Features.Common;

internal record QuantifiableItem(int Id, string Name, string Value, Maybe<string> Unit, bool Checked);