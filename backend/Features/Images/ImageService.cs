using System.Net;
using CSharpFunctionalExtensions;

namespace Cookbook.Features.Images;

internal class ImageService : IImageService
{
  private readonly string _storageLocation;

  public ImageService()
  {
    _storageLocation = $"{Directory.GetCurrentDirectory()}/uploads/";
    CreateFolderForImagesIfNotExists();
  }

  public async Task<string> Save(IFormFile image, string nameToBeSavedUnder)
  {
    var imageFormat = GetExtensionFromContentType(image.ContentType);
    
    var fileFullPath = $"{_storageLocation}{nameToBeSavedUnder}{imageFormat}";
    await using var fileStream = new FileStream(fileFullPath, FileMode.Create);

    await image.CopyToAsync(fileStream);

    return $"{nameToBeSavedUnder}{imageFormat}";
  }

  public void Delete(string fileName)
  {
    var file = Directory.GetFiles(_storageLocation, $"{fileName}*").ToArray();
    if (file.Length == 0)
    {
      // Nothing to delete
      return;
    }
    
    File.Delete(file.Single());
  }

  public async Task<Result<byte[], Error>> Get(string fileName)
  {
    var sanitizedFileName = Path.GetFileName(fileName);
    var fileFullPath = $"{_storageLocation}{sanitizedFileName}";

    if (File.Exists(fileFullPath) == false)
    {
      return new Error(HttpStatusCode.NotFound, "Image not found");
    }

    return await File.ReadAllBytesAsync(fileFullPath);
  }

  private static string GetExtensionFromContentType(string contentType)
  {
    return contentType switch
    {
      "image/jpeg" => ".jpg",
      "image/png" => ".png",
      "image/webp" => ".webp",
      _ => throw new NotSupportedException($"Image format {contentType} is not supported."),
    };
  }

  private void CreateFolderForImagesIfNotExists()
  {
    if (Directory.Exists(_storageLocation) == false)
    {
      Directory.CreateDirectory(_storageLocation);
    }
  }
}
