using CSharpFunctionalExtensions;

namespace Cookbook.Features.Common.Models;

internal record Amount(string Value, Maybe<string> Unit);