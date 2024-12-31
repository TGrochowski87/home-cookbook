namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingListGetDto(int Id, string Name, bool AutoDelete, DateTime CreationDate, DateTime UpdateDate);