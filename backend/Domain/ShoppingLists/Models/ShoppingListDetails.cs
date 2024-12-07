namespace Cookbook.Domain.ShoppingLists.Models;

internal record ShoppingListDetails(int Id, string Name, DateTime CreationDate, DateTime UpdateDate, List<ShoppingSublist> Sublists) 
  : ShoppingList(Id, Name, CreationDate, UpdateDate);