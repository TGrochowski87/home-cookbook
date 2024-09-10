using CSharpFunctionalExtensions;

namespace Cookbook.Extensions;

public static class TaskFunctionalExtensions
{
  public static Result<T> ToResult<T>(this T obj)
  {
    return Result.Success(obj);
  }
  
  public static Result<T, E> ToResult<T, E>(this T obj)
  {
    return Result.Success<T, E>(obj);
  }
  
  public static async Task<Result<T>> ToResultAsync<T>(this Task<T> task)
  {
    var awaitable = await task.ConfigureAwait(false);
    return awaitable.ToResult();
  }
  
  public static async Task<Result<T, E>> ToResultAsync<T, E>(this Task<T> task)
  {
    var awaitable = await task.ConfigureAwait(false);
    return awaitable.ToResult<T, E>();
  }
        
  public static async ValueTask<Result<T>> ToResultAsync<T>(this ValueTask<T> task)
  {
    var awaitable = await task.ConfigureAwait(false);
    return awaitable.ToResult();
  }
        
  public static async ValueTask<Result<T, E>> ToResultAsync<T, E>(this ValueTask<T> task)
  {
    var awaitable = await task.ConfigureAwait(false);
    return awaitable.ToResult<T, E>();
  }
}