namespace Cookbook.Features.Tags;

internal class TagService(ITagRepository tagRepository) : ITagService
{
  public async Task<int> Create(TagCreate data) 
    => await tagRepository.Create(data);

  public async Task<List<TagGet>> GetAll()
    => await tagRepository.GetAll();
}