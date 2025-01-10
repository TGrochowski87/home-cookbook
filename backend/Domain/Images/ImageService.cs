using System.Net;
using CSharpFunctionalExtensions;

namespace Cookbook.Domain.Images;

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
    var imageFormat = Path.GetExtension(fileName).ToLowerInvariant();
    if (_allowedImageFormats.Contains(imageFormat) == false)
    {
      return new Error(
        HttpStatusCode.UnsupportedMediaType,
        $"Supported image formats are: {string.Join(", ", _allowedImageFormats)}");
    }

    var sanitizedFileName = Path.GetFileName(fileName);
    var fileFullPath = $"{_storageLocation}{sanitizedFileName}";

    if (File.Exists(fileFullPath) == false)
    {
      return new Error(HttpStatusCode.NotFound, "Image not found");
    }

    return await File.ReadAllBytesAsync(fileFullPath);
  }

  private UnitResult<Error> DeleteFileByName(string fileName)
  {
    File.Delete(fileName);
    return UnitResult.Success<Error>();
  }

  private void CreateFolderForImagesIfNotExists()
  {
    if (Directory.Exists(_storageLocation) == false)
    {
      Directory.CreateDirectory(_storageLocation);
    }
  }
}
