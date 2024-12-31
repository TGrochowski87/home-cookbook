namespace Cookbook.Contracts.ShoppingLists;

public record ShoppingListDetailsGetDto(
  int Id, 
  string Name, 
  bool AutoDelete, 
  DateTime CreationDate, 
  DateTime UpdateDate, 
  List<ShoppingSublistGetDto> Sublists) 
  : ShoppingListGetDto(Id, Name, AutoDelete, CreationDate, UpdateDate);