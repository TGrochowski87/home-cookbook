using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Common;

public class AmountCreateDto
{
  [FromForm(Name = "value")] 
  public required string Value { get; set; }

  [FromForm(Name = "unit")] 
  public string? Unit { get; set; }
}