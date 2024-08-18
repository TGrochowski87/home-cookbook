using CSharpFunctionalExtensions;

namespace Cookbook.Features.Images;

internal interface IImageService
{
  Task<string> Save(IFormFile image, string nameToBeSavedUnder);

  Result<FileStream, Error> Get(string fileName);
}
