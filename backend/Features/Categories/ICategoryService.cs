using Cookbook.Features.Categories.Models;

namespace Cookbook.Features.Categories;

internal interface ICategoryService
{
  Task<List<Category>> GetAll();
}