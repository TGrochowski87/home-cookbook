using Cookbook.Features.Categories;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Categories;

public class CategoriesEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/categories", GetAllCategories)
      .Produces<List<CategoryGetDto>>()
      .WithTags("Categories");
  }

  private static async Task<IResult> GetAllCategories([FromServices] ICategoryService categoryService)
  {
    var categories = await categoryService.GetAll();
    var categoryDtos = EndpointModelMapper.Map(categories);
    return Results.Ok(categoryDtos);
  }
}