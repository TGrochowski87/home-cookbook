using CSharpFunctionalExtensions;

namespace Cookbook.Features.Images;

internal interface IImageService
{
  Task<string> Save(IFormFile image, string nameToBeSavedUnder);
  
  void Delete(string fileName);

  Task<Result<byte[], Error>> Get(string fileName);
}
