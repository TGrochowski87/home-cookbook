using CSharpFunctionalExtensions;
using System.Net;

namespace Cookbook.Features.Images;

internal class ImageService : IImageService
{
  private readonly List<string> _allowedImageFormats = [".jpeg", ".jpg", ".png", ".webp"];
  private readonly string _storageLocation;

  public ImageService()
  {
    _storageLocation = $"{Directory.GetCurrentDirectory()}/uploads/";
    CreateFolderForImagesIfNotExists();
  }

  public async Task<string> Save(IFormFile image, string nameToBeSavedUnder)
  {
    var imageFormat = Path.GetExtension(image.FileName).ToLowerInvariant();
    
    var fileFullPath = $"{_storageLocation}{nameToBeSavedUnder}{imageFormat}";
    using var fileStream = new FileStream(fileFullPath, FileMode.Create);

    await image.CopyToAsync(fileStream);

    return $"{nameToBeSavedUnder}{imageFormat}";
  }

  public Result<FileStream, Error> Get(string fileName)
  {
    var sanitizedFileName = Path.GetFileName(fileName);

    var imageFormat = sanitizedFileName.Split('.')[^1];
    // TODO: Could this be validated by validators?
    if (_allowedImageFormats.Contains(imageFormat) == false)
    {
      return new Error(
        HttpStatusCode.UnsupportedMediaType,
        $"Supported image formats are: {String.Join(", ", _allowedImageFormats)}");
    }

    var fileFullPath = $"{_storageLocation}{sanitizedFileName}";

    if (File.Exists(fileFullPath) == false)
    {
      return new Error(HttpStatusCode.NotFound, "Image not found");
    }

    return File.OpenRead(fileFullPath);
  }

  private void CreateFolderForImagesIfNotExists()
  {
    if (Directory.Exists(_storageLocation) == false)
    {
      Directory.CreateDirectory(_storageLocation);
    }
  }
}
