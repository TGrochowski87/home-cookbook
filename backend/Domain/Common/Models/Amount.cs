using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Common.Models;

internal record Amount(Maybe<string> Value, Maybe<string> Unit);