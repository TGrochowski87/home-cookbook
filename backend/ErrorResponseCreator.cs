namespace Cookbook;

internal static class ErrorResponseCreator
{
  public static TResult Create<TResult>(Error error) where TResult : IResult
  {
    // TODO: Log error with contained exception.
    IResult test = error.StatusCode switch
    {
      System.Net.HttpStatusCode.NotFound => TypedResults.NotFound(),
      _ => TypedResults.Problem(detail: error.Message, statusCode: (int?)error.StatusCode)
    };

    return (TResult)test;
  }
}
