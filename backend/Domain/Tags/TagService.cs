namespace Cookbook.Domain.Tags;

internal class TagService(ITagRepository tagRepository) : ITagService
{
  public async Task<int> Create(TagCreate tag) 
    => await tagRepository.Create(tag);

  public async Task<List<int>> CreateMany(List<TagCreate> tags) 
    => await tagRepository.CreateMany(tags);

  public async Task<List<TagGet>> GetAll()
    => await tagRepository.GetAll();
}