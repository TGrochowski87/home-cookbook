using Cookbook.Contracts.Tags;
using FluentValidation;

namespace Cookbook.Validation;

public class TagValidator : AbstractValidator<TagCreateDto>
{
  public TagValidator()
  {
    RuleFor(t => t.Name)
      .MaximumLength(100)
      .WithMessage("Tekst tagu nie może być dłuższy niż 100 znaków.");
  }
}
