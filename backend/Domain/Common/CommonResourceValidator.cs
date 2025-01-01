using System.Net;
using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Common;

internal static class CommonResourceValidator
{
  public static UnitResult<Error> VerifyResourceStateNotOutdated(DateTime resourceStateTimestampFromRequest, DateTime resourceUpdateDate)
  {
    return resourceUpdateDate > resourceStateTimestampFromRequest
      ? new Error(HttpStatusCode.PreconditionFailed, "The resource has been modified in the meantime.") 
      : UnitResult.Success<Error>();
  }
}