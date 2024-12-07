using Cookbook.Contracts.Common;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Recipes;

public class QuantifiableItemCreateDto
{
  [FromForm(Name = "name")]
  public required string Name { get; set; }
  
  [FromForm(Name = "amount")]
  public required AmountCreateDto Amount { get; set; }
}