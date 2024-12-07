using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Common.Models;

internal record Amount(string Value, Maybe<string> Unit);