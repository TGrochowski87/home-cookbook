using Cookbook.Contracts.Common;
using Cookbook.Contracts.Recipes;
using FluentValidation;

namespace Cookbook.Validation;

public class QuantifiableItemValidator : AbstractValidator<QuantifiableItemCreateDto>
{
  public QuantifiableItemValidator()
  {
    RuleFor(item => item.Name.Length)
      .LessThanOrEqualTo(100)
      .WithMessage(item => $"The item's name must not be longer than 100 characters. Provided name: {item.Name}.");

    RuleFor(item => item.Amount)
      .Must(amount => amount.Value!.Length <= 20)
      .WithMessage(item => $"The amount value must not be longer than 20 characters. Provided value: {item.Amount.Value}.") 
      .When(item => item.Amount.Value != null, ApplyConditionTo.CurrentValidator)
      .Must(amount => amount.Unit!.Length <= 10)
      .WithMessage(item => $"The amount unit must not be longer than 10 characters. Provided value: {item.Amount.Unit}.")
      .When(item => item.Amount.Unit != null, ApplyConditionTo.CurrentValidator);
  }
}
