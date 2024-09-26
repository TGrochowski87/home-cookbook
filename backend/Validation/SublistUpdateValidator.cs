using Cookbook.Contracts.ShoppingLists;
using FluentValidation;

namespace Cookbook.Validation;

public class SublistUpdateValidator : AbstractValidator<ShoppingSublistUpdateDto>
{
  public SublistUpdateValidator()
  {
    RuleFor(dto => dto.Count)
      .GreaterThan(0)
      .WithMessage("Mnożnik składników przepisu nie może być mniejszy od 1.");
  }
}