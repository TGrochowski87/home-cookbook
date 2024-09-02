namespace Cookbook.Features.Tags;

internal interface ITagService
{
  Task<List<TagGet>> GetAll();

  Task<int> Create(TagCreate tag);
  
  Task<List<int>> CreateMany(List<TagCreate> tags);
}