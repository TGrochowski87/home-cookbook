using Cookbook.Contracts.ShoppingLists;
using FluentValidation;

namespace Cookbook.Validation;

public class ShoppingListCreateValidator : AbstractValidator<ShoppingListCreateDto>
{
  public ShoppingListCreateValidator()
  {
    RuleFor(shoppingList => shoppingList.Name)
      .MaximumLength(100)
      .WithMessage(shoppingList => $"The shopping list's name must not be longer than 100 characters. " +
                                   $"Provided name: {shoppingList.Name}.");
  }
}