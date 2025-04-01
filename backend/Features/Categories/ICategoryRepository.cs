using Cookbook.Features.Categories.Models;

namespace Cookbook.Features.Categories;

internal interface ICategoryRepository
{
  Task<List<Category>> GetAll();
}