using Cookbook.Contracts.ShoppingLists.Update;
using FluentValidation;

namespace Cookbook.Validation;

public class ShoppingListUpdateValidator : AbstractValidator<ShoppingListUpdateDto>
{
  public ShoppingListUpdateValidator()
  {
    RuleFor(sl => sl.Name)
      .MaximumLength(100)
      .WithMessage("Nazwa listy powinna mieć maksymalnie 100 znaków.")
      .When(sl => string.IsNullOrEmpty(sl.Name) == false)
      .NotNull()
      .WithMessage("Przynajmniej jeden atrybut obiektu listy musi mieć podaną wartość.")
      .When(sl => sl.Sublists is null, ApplyConditionTo.CurrentValidator);

    RuleForEach(sl => sl.Sublists).ChildRules(sublist =>
    {
      sublist.RuleFor(sub => sub.State!)
        .SetValidator(new ShoppingSublistStateUpdateValidator())
        .When(sub => sub.State is not null);
    }).When(sl => sl.Sublists is not null);
  }

  private class ShoppingSublistStateUpdateValidator : AbstractValidator<ShoppingSublistStateUpdateDto>
  {
    public ShoppingSublistStateUpdateValidator()
    {
      RuleFor(ss => ss.Count)
        .GreaterThan(0)
        .WithMessage("Mnożnik podlisty zakupów musi mieć wartość wyższą od zera.")
        .When(ss => ss.Count is not null)
        .NotNull()
        .WithMessage("Przynajmniej jeden atrybut obiektu stanu podlisty musi mieć podaną wartość.")
        .When(ss => ss.Items is null, ApplyConditionTo.CurrentValidator);
          
      RuleForEach(ss => ss.Items)
        .SetValidator(new ListItemUpdateValidator())
        .When(ss => ss.Items is not null);
    }
  }

  private class ListItemUpdateValidator : AbstractValidator<ListItemUpdateDto>
  {
    public ListItemUpdateValidator()
    {
      RuleFor(item => item.Id)
        .NotNull()
        .When(item => item.State is null)
        .WithMessage("Identyfikator przedmiotu z listy i jego stan nie mogą być puste jednocześnie.");
      
      When(item => item.Id is not null, () =>
      {
        RuleFor(item => item.State).ChildRules(state =>
        {
          state.RuleFor(x => x!.Amount)
            .Null()
            .WithMessage("Ilość raz utworzonego przedmiotu nie jest edytowalna.");
          
          state.RuleFor(x => x!.Name)
            .Null()
            .WithMessage("Nazwa raz utworzonego przedmiotu nie jest edytowalna.");
        }).When(item => item.State is not null);
      }).Otherwise(() =>
      {
        RuleFor(item => item.State).ChildRules(state =>
        {
          state.RuleFor(x => x!.Amount)
            .NotNull()
            .WithMessage("Dane o ilości są wymagane podczas tworzenia przedmiotu.")
            .ChildRules(amount =>
            {
              amount.RuleFor(x => x!.Value)
                .Must(value => value.Length <= 20)
                .WithMessage("Tekst określający ilość powinien mieć maksymalnie 20 znaków.");
              
              amount.RuleFor(x => x!.Unit)
                .Must(unit => unit!.Length <= 10)
                .WithMessage("Tekst określający jednostkę powinien mieć maksymalnie 10 znaków.")
                .When(x => x!.Unit != null);
            });
          
          state.RuleFor(x => x!.Name)
            .NotNull()
            .WithMessage("Nazwa jest wymagana podczas tworzenia przedmiotu.");
          
          state.RuleFor(x => x!.Checked)
            .NotNull()
            .WithMessage("Status zaznaczenia jest wymagany podczas tworzenia przedmiotu.");
        }).When(item => item.State is not null);
      });
    }
  }
}