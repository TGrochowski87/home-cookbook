using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingSublistCreateDto([FromBody] int RecipeId);