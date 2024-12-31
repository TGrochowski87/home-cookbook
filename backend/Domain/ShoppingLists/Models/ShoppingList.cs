namespace Cookbook.Domain.ShoppingLists.Models;

internal record ShoppingList(int Id, string Name, bool AutoDelete, DateTime CreationDate, DateTime UpdateDate);