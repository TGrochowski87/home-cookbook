using System.Net;
using Cookbook.DataAccess;
using Cookbook.Features.Tags.Models;
using Cookbook.Mappers;
using CSharpFunctionalExtensions;
using EntityFramework.Exceptions.Common;
using Microsoft.EntityFrameworkCore;

namespace Cookbook.Features.Tags.Repository;

internal class TagRepository(CookbookContext context) : ITagRepository
{
  public async Task<Result<int, Error>> Create(TagCreate tag)
  {
    var newTag = RepositoryModelMapper.Map(tag);

    context.Tags.Add(newTag);
    
    try
    {
      await context.SaveChangesAsync();
    }
    catch (UniqueConstraintException)
    {
      return new Error(HttpStatusCode.BadRequest, $"A tag with name '{tag.Name}' already exists.");
    }

    return newTag.Id;
  }

  public async Task<Result<List<int>,Error>> CreateMany(List<TagCreate> tags)
  {
    var newTags = tags.Select(RepositoryModelMapper.Map).ToList();

    context.Tags.AddRange(newTags);
    
    try
    {
      await context.SaveChangesAsync();
    }
    catch (UniqueConstraintException e)
    {
      var constrainViolatingName = (e.Entries[0].Entity as Tag)?.Name;
      return new Error(HttpStatusCode.BadRequest, $"A tag with name '{constrainViolatingName}' already exists.");
    }

    return newTags.Select(t => t.Id).ToList();
  }

  public async Task<List<TagGet>> GetAll()
  {
    var entities = await context.Tags.AsNoTracking().ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }
}