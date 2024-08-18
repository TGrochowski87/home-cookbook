using Cookbook.Features.Tags.Models;

namespace Cookbook.Features.Tags;

internal interface ITagRepository
{
  Task<List<TagGet>> GetAll();

  Task<int> Create(TagCreate data);
}