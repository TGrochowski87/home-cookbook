namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingListDetailsGetDto(
  int Id, 
  string Name, 
  DateTime CreationDate, 
  DateTime UpdateDate, 
  List<ShoppingSublistGetDto> Sublists) 
  : ShoppingListGetDto(Id, Name, CreationDate, UpdateDate);