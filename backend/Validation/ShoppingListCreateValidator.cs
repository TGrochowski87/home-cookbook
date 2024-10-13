using Cookbook.Contracts.ShoppingLists;
using FluentValidation;

namespace Cookbook.Validation;

public class ShoppingListCreateValidator : AbstractValidator<ShoppingListCreateDto>
{
  public ShoppingListCreateValidator()
  {
    RuleFor(sl => sl.Name)
      .MaximumLength(100)
      .WithMessage("Nazwa listy zakupów nie może być dłuższa niż 100 znaków.");
  }
}