using CSharpFunctionalExtensions;
using System.Net;

namespace Cookbook;

// TODO: Is the exception needed?
internal class Error(HttpStatusCode statusCode, string message, Exception? exception = null)
{
  public HttpStatusCode StatusCode { get; } = statusCode;
  public string Message { get; } = message;
  public Maybe<Exception> Exception { get; } = exception ?? Maybe<Exception>.None;
}
