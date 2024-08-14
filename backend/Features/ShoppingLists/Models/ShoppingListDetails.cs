namespace Cookbook.Features.ShoppingLists;

internal record ShoppingListDetails(int Id, string Name, DateTime CreationDate, DateTime UpdateDate, List<ShoppingSublist> Sublists) 
  : ShoppingList(Id, Name, CreationDate, UpdateDate);