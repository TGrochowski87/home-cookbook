using System.Net;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Common;

internal static class CommonResourceValidator
{
  public static UnitResult<Error> VerifyResourceStateNotOutdated(DateTime resourceStateTimestampFromRequest, DateTime resourceUpdateDate)
  {
    // TODO: I am actually not using these messages on UI. Change to english.
    return resourceUpdateDate > resourceStateTimestampFromRequest 
      ? new Error(HttpStatusCode.PreconditionFailed, "Zasób został w międzyczasie zmodyfikowany.") 
      : UnitResult.Success<Error>();
  }
}