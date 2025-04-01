﻿using Cookbook.DataAccess;
using Cookbook.Mappers;
using Microsoft.EntityFrameworkCore;
using Category = Cookbook.Features.Categories.Models.Category;

namespace Cookbook.Features.Categories;

internal class CategoryRepository(CookbookContext context) : ICategoryRepository
{
  public async Task<List<Category>> GetAll()
  {
    var entities = await context.Categories.AsNoTracking().ToListAsync();
    return RepositoryModelMapper.Map(entities);
  }
}