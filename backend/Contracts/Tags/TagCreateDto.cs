using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Tags;

public class TagCreateDto
{
  [FromForm(Name = "name")]
  public required string Name { get; set; }
}