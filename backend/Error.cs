using System.Net;

namespace Cookbook;

internal class Error(HttpStatusCode statusCode, string message)
{
  public HttpStatusCode StatusCode { get; } = statusCode;
  public string Message { get; } = message;
}
