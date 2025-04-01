using CSharpFunctionalExtensions;

namespace Cookbook.Features.Common.Models;

internal record Amount(Maybe<string> Value, Maybe<string> Unit);