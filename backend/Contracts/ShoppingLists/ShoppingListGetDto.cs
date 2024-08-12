namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingListGetDto(int Id, string Name, DateTime CreationDate, DateTime UpdateDate);