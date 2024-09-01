using Cookbook.Contracts.Common;
using Cookbook.Contracts.Tags;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Recipes;

public class RecipeCreateDto
{
  [FromForm(Name = "name")]
  public required string Name { get; set; }
  
  [FromForm(Name = "categoryId")]
  public required int CategoryId { get; set; }
  
  [FromForm(Name = "description")]
  public string? Description { get; set; }
  
  [FromForm(Name = "tagIds")]
  public List<int>? TagIds { get; set; }
  
  [FromForm(Name = "newTags")]
  public List<TagCreateDto>? NewTags { get; set; }
  
  [FromForm(Name = "image")]
  public IFormFile? Image { get; set; }
  
  [FromForm(Name = "ingredients")]
  public List<QuantifiableItemCreateDto>? Ingredients { get; set; }
}