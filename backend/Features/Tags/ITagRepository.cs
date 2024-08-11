namespace Cookbook.Features.Tags;

internal interface ITagRepository
{
  Task<List<Tag>> GetAll();
}