using Cookbook.Contracts.Tags;
using FluentValidation;

namespace Cookbook.Validation;

public class TagValidator : AbstractValidator<TagCreateDto>
{
  public TagValidator()
  {
    RuleFor(tag => tag.Name)
      .MaximumLength(100)
      .WithMessage(tag => $"The tag must not be longer than 100 characters. Provided: {tag.Name}.");
  }
}
