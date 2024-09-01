namespace Cookbook.Features.Tags;

internal interface ITagRepository
{
  Task<List<TagGet>> GetAll();

  Task<int> Create(TagCreate data);
}