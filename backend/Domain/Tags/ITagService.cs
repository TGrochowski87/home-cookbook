using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Tags;

internal interface ITagService
{
  Task<List<TagGet>> GetAll();

  Task<Result<int, Error>> Create(TagCreate tag);
  
  Task<Result<List<int>,Error>> CreateMany(List<TagCreate> tags);
}