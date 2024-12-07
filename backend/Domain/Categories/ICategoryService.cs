using Cookbook.Domain.Categories.Models;

namespace Cookbook.Domain.Categories;

internal interface ICategoryService
{
  Task<List<Category>> GetAll();
}