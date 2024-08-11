namespace Cookbook.Features.Tags;

internal class TagService(ITagRepository tagRepository) : ITagService
{
  public async Task<List<Tag>> GetAll() 
    => await tagRepository.GetAll();
}