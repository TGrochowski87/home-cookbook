namespace Cookbook.Domain.ShoppingLists.Models;

internal record ShoppingListDetails(int Id, string Name, bool AutoDelete, DateTime CreationDate, DateTime UpdateDate, List<ShoppingSublist> Sublists) 
  : ShoppingList(Id, Name, AutoDelete, CreationDate, UpdateDate);