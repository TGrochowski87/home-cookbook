using Cookbook.Features.Tags;
using Microsoft.AspNetCore.Mvc;

namespace Cookbook.Contracts.Tags;

public class TagsEndpoints : IEndpointsDefinition
{
  public void MapEndpoints(WebApplication app)
  {
    app.MapGet("/tags", GetAllTags)
      .Produces<List<TagGetDto>>()
      .WithTags("Tags");
  }

  private static async Task<IResult> GetAllTags([FromServices] ITagService tagService)
  {
    var tags = await tagService.GetAll();
    var tagDtos = tags.Select(t => new TagGetDto(t.Id, t.Name));
    return Results.Ok(tagDtos);
  }
}