using Cookbook.Contracts.ShoppingLists;
using FluentValidation;

namespace Cookbook.Validation;

public class ShoppingListUpdateValidator : AbstractValidator<ShoppingListUpdateDto>
{
  public ShoppingListUpdateValidator()
  {
    RuleFor(shoppingList => shoppingList.Name)
      .MaximumLength(100)
      .WithMessage(shoppingList => $"The shopping list's name must not be longer than 100 characters. " +
                                   $"Provided name: {shoppingList.Name}.");

    RuleFor(shoppingList => shoppingList.Sublists)
      .NotEmpty()
      .WithMessage("The shopping list must have at least the manual sublist.");

    RuleForEach(shoppingList => shoppingList.Sublists).SetValidator(new ShoppingSublistUpdateValidator());
  }

  private class ShoppingSublistUpdateValidator : AbstractValidator<ShoppingSublistUpdateDto>
  {
    public ShoppingSublistUpdateValidator()
    {
      RuleFor(sublist => sublist.Count)
        .GreaterThan(0)
        .WithMessage("The shopping list's multiplier must be greater than zero.");

      RuleForEach(sublist => sublist.Items).SetValidator(new ShoppingListItemUpdateValidator());
    }
  }

  private class ShoppingListItemUpdateValidator : AbstractValidator<ShoppingListItemUpdateDto>
  {
    public ShoppingListItemUpdateValidator()
    {
      RuleFor(item => item.Name)
        .MaximumLength(100)
        .WithMessage(item => $"The shopping list item's name must not be longer than 100 characters. Provided name: {item.Name}.");

      RuleFor(item => item.Amount)
        .Must(amount => amount.Value!.Length <= 20)
        .WithMessage(item => $"The amount value must not be longer than 20 characters. Provided value: {item.Amount.Value}.")
        .When(item => item.Amount.Value != null, ApplyConditionTo.CurrentValidator)
        .Must(amount => amount.Unit!.Length <= 10)
        .WithMessage(item => $"The amount unit must not be longer than 10 characters. Provided value: {item.Amount.Unit}.")
        .When(item => item.Amount.Unit != null, ApplyConditionTo.CurrentValidator);
    }
  }
}