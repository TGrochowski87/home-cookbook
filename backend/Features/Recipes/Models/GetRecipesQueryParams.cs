using CSharpFunctionalExtensions;

namespace Cookbook.Features.Recipes;

public record GetRecipesQueryParams(Maybe<Filtering> Filtering, Paging Paging);

public record Filtering(Maybe<string> Name, Maybe<string> Category, string[] Tags);

public record Paging(string LastName, int LastId, int PageSize);