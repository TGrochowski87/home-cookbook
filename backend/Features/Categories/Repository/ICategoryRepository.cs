using Cookbook.Features.Categories.Models;

namespace Cookbook.Features.Categories.Repository;

internal interface ICategoryRepository
{
  Task<List<Category>> GetAll();
}