using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Common;

public class AmountCreateDto
{
  [FromForm(Name = "value")] 
  public string? Value { get; set; }

  [FromForm(Name = "unit")] 
  public string? Unit { get; set; }
}