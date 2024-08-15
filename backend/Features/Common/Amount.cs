using CSharpFunctionalExtensions;

namespace Cookbook.Features.Common;

internal record Amount(string Value, Maybe<string?> Unit);