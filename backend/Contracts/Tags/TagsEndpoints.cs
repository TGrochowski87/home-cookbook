using Cookbook.Features.Tags;
using Cookbook.Mappers;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Tags;

public class TagsEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/tags", GetAllTags)
      .WithTags("Tags");
  }

  private static async Task<Ok<List<TagGetDto>>> GetAllTags([FromServices] ITagService tagService)
  {
    var tags = await tagService.GetAll();
    var tagDtos = EndpointModelMapper.Map(tags);
    return TypedResults.Ok(tagDtos);
  }
}