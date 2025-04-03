using Cookbook.Contracts.Recipes;
using FluentValidation;

namespace Cookbook.Validation;

public class RecipeValidator : AbstractValidator<RecipeCreateDto>
{
  private const int _maxFileSize = 6291456;
  private readonly List<string> _allowedImageFormats = ["image/jpeg", "image/png", "image/webp"];

  public RecipeValidator()
  {
    RuleFor(recipe => recipe.Name)
      .MaximumLength(100)
      .WithMessage(recipe => $"The recipe's name must not be longer than 100 characters. Provided name: {recipe.Name}."); 

    RuleForEach(recipe => recipe.NewTags).SetValidator(new TagValidator());

    When(recipe => recipe.Image != null, () =>
    {
      RuleFor(recipe => recipe.Image!)
      .Must(image => image.Length <= _maxFileSize)
      .WithMessage(recipe => $"The image size limit is 6MB. Size of the provided image: {recipe.Image!.Length / 1024}KB.")
      .Must(image => _allowedImageFormats.Contains(image.ContentType))
      .WithMessage(recipe => $"The image must be in one of the following formats: {string.Join(", ", _allowedImageFormats)}. " +
                             $"Format of the provided image: {recipe.Image!.ContentType}.");
    });

    RuleForEach(r => r.Ingredients).SetValidator(new QuantifiableItemValidator());
  }
}
