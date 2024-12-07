namespace Cookbook.Domain.Categories;

internal interface ICategoryService
{
  Task<List<Category>> GetAll();
}