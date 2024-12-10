using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Tags;

internal class TagService(ITagRepository tagRepository) : ITagService
{
  public async Task<Result<int, Error>> Create(TagCreate tag) 
    => await tagRepository.Create(tag);

  public async Task<Result<List<int>,Error>> CreateMany(List<TagCreate> tags) 
    => await tagRepository.CreateMany(tags);

  public async Task<List<TagGet>> GetAll()
    => await tagRepository.GetAll();
}