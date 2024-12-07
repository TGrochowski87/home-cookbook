using Cookbook.Domain.Categories.Models;

namespace Cookbook.Domain.Categories;

internal interface ICategoryRepository
{
  Task<List<Category>> GetAll();
}