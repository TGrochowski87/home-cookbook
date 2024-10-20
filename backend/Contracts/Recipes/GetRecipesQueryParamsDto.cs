using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Recipes;

public record GetRecipesQueryParamsDto(
  [FromQuery] string? Name,
  [FromQuery] string? Category,
  [FromQuery] string[]? Tags,
  [FromQuery] string? LastName, 
  [FromQuery] int? LastId, 
  [FromQuery] int PageSize = 20);