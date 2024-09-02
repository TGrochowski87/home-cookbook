using CSharpFunctionalExtensions;

namespace Cookbook.Features.Images;

internal interface IImageService
{
  Task<string> Save(IFormFile image, string nameToBeSavedUnder);

  Task<Result<byte[], Error>> Get(string fileName);
}
