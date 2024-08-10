using Cookbook.Features.Categories;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Categories;

public class CategoriesEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/categories", GetAllCategories)
      .Produces<List<CategoryGetDto>>();
  }

  private static async Task<IResult> GetAllCategories([FromServices] ICategoryService categoryService)
  {
    var categories = await categoryService.GetAll();
    var categoryDtos = categories.Select(c => new CategoryGetDto(c.Id, c.Name, c.Color));
    return Results.Ok(categoryDtos);
  }
}