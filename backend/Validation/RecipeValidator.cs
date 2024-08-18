using Cookbook.Contracts.Recipes;
using FluentValidation;

namespace Cookbook.Validation;

public class RecipeValidator : AbstractValidator<RecipeCreateDto>
{
  private const int _maxFileSize = 3145728;
  private readonly List<string> _allowedImageFormats = [".jpeg", ".jpg", ".png", ".webp"];

  public RecipeValidator()
  {
    RuleFor(t => t.Name)
      .MaximumLength(100)
      .WithMessage("Nazwa przepisu nie może być dłuższa niż 100 znaków.");

    RuleForEach(r => r.NewTags).SetValidator(new TagValidator());

    When(r => r.Image != null, () =>
    {
      RuleFor(r => r.Image!)
      .Must(i => i.Length <= _maxFileSize)
      .WithMessage("Limit rozmiaru zdjęcia wynosi 3MB.")
      .Must(i => _allowedImageFormats.Contains(Path.GetExtension(i.FileName).ToLowerInvariant()))
      .WithMessage($"Zdjęcie musi być w jednym z tych formatów: {String.Join(", ", _allowedImageFormats)}");
    });

    RuleForEach(r => r.Ingredients).SetValidator(new QuantifiableItemValidator());
  }
}
