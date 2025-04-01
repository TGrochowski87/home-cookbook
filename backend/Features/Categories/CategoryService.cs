using Cookbook.Features.Categories.Models;

namespace Cookbook.Features.Categories;

internal class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
  public async Task<List<Category>> GetAll()
    => await categoryRepository.GetAll();
}