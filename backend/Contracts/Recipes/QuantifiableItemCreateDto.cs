using Cookbook.Contracts.Common;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Recipes;

public class QuantifiableItemCreateDto
{
  [FromForm(Name = "name")]
  public required string Name { get; set; }
  
  // Both Value and Unit are nullable so Amount must be as well, because I can't pass empty object to form. 
  [FromForm(Name = "amount")]
  public AmountCreateDto? Amount { get; set; }
}