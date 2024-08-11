namespace Cookbook.Features.Tags;

internal interface ITagService
{
  Task<List<Tag>> GetAll();
}