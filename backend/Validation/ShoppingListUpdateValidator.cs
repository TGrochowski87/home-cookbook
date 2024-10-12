using Cookbook.Contracts.ShoppingLists.Update;
using FluentValidation;

namespace Cookbook.Validation;

public class ShoppingListUpdateValidator : AbstractValidator<ShoppingListUpdateDto>
{
  public ShoppingListUpdateValidator()
  {
    RuleFor(l => l.Name)
      .MaximumLength(100)
      .WithMessage("Nazwa listy powinna mieć maksymalnie 100 znaków.");

    RuleFor(l => l.Sublists)
      .NotEmpty()
      .WithMessage("Lista zakupów musi zawierać przynajmniej manualną podlistę.");

    RuleForEach(l => l.Sublists).SetValidator(new ShoppingSublistUpdateValidator());
  }

  private class ShoppingSublistUpdateValidator : AbstractValidator<ShoppingSublistUpdateDto>
  {
    public ShoppingSublistUpdateValidator()
    {
      RuleFor(sl => sl.Count)
        .GreaterThan(0)
        .WithMessage("Mnożnik podlisty zakupów musi mieć wartość wyższą od zera.");

      RuleForEach(sl => sl.Items).SetValidator(new ShoppingListItemUpdateValidator());
    }
  }

  private class ShoppingListItemUpdateValidator : AbstractValidator<ShoppingListItemUpdateDto>
  {
    public ShoppingListItemUpdateValidator()
    {
      RuleFor(i => i.Name)
        .MaximumLength(100)
        .WithMessage("Nazwa przedmiotu z listy powinna mieć maksymalnie 100 znaków.");

      RuleFor(item => item.Amount)
        .Must(amount => amount.Value.Length <= 20)
        .WithMessage("Tekst określający ilość powinien mieć maksymalnie 20 znaków.")
        .Must(amount => amount.Unit!.Length <= 10)
        .WithMessage("Tekst określający jednostkę powinien mieć maksymalnie 10 znaków.")
        .When(item => item.Amount.Unit != null, ApplyConditionTo.CurrentValidator);
    }
  }
}