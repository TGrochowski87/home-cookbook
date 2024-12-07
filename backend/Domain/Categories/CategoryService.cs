namespace Cookbook.Domain.Categories;

internal class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
  public async Task<List<Category>> GetAll()
    => await categoryRepository.GetAll();
}