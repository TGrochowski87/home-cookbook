using Cookbook.Features.Tags.Models;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Tags.Repository;

internal interface ITagRepository
{
  Task<List<TagGet>> GetAll();

  Task<Result<int, Error>> Create(TagCreate tag);
  
  Task<Result<List<int>,Error>> CreateMany(List<TagCreate> tags);
}