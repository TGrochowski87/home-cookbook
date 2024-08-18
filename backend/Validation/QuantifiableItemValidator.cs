using Cookbook.Contracts.Common;
using FluentValidation;

namespace Cookbook.Validation;

public class QuantifiableItemValidator : AbstractValidator<QuantifiableItemCreateDto>
{
  public QuantifiableItemValidator()
  {
    RuleFor(item => item.Name.Length)
      .LessThanOrEqualTo(100)
      .WithMessage("Nazwa przedmiotu z listy powinna mieć maksymalnie 100 znaków.");

    RuleFor(item => item.Amount)
      .Must(amount => amount.Value.Length <= 20)
      .WithMessage("Tekst określający ilość powinien mieć maksymalnie 20 znaków.")
      .Must(amount => amount.Unit!.Length <= 10)
      .WithMessage("Tekst określający jednostkę powinien mieć maksymalnie 10 znaków.")
      .When(item => item.Amount.Unit != null, ApplyConditionTo.CurrentValidator);
  }
}
