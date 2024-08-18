using Cookbook.DataAccess;
using Microsoft.EntityFrameworkCore.Storage;

namespace Cookbook;

internal class CookbookTransaction : IDisposable
{
  private readonly IDbContextTransaction _transaction;

  public CookbookTransaction(CookbookContext dbContext)
  {
    _transaction = dbContext.Database.BeginTransaction();
  }

  public void Commit()
  {
    _transaction.Commit();
  }

  public void Rollback()
  {
    _transaction.Rollback();
  }

  public void Dispose()
  {
    _transaction.Dispose();
  }
}
