using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Images;

internal interface IImageService
{
  Task<string> Save(IFormFile image, string nameToBeSavedUnder);
  
  void Delete(string fileName);

  Task<Result<byte[], Error>> Get(string fileName);
}
