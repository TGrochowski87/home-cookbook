using Cookbook.Contracts.Categories;
using Cookbook.Contracts.Common;
using Cookbook.Contracts.Recipes;
using Cookbook.Contracts.ShoppingLists;
using Cookbook.Contracts.Tags;
using Cookbook.Domain.Common.Models;
using Cookbook.Domain.Recipes.Models;
using Cookbook.Domain.ShoppingLists.Models;
using Cookbook.Domain.Tags;
using CSharpFunctionalExtensions;
using Category = Cookbook.Domain.Categories.Models.Category;
using QuantifiableItemGet = Cookbook.Domain.Common.Models.QuantifiableItemGet;
using RecipeGet = Cookbook.Domain.Recipes.Models.RecipeGet;
using ShoppingList = Cookbook.Domain.ShoppingLists.Models.ShoppingList;
using TagGet = Cookbook.Domain.Tags.TagGet;

namespace Cookbook.Mappers;

internal static class EndpointModelMapper
{
  public static CategoryGetDto Map(Category domainModel)
    => new(domainModel.Id, domainModel.Name, domainModel.Color, domainModel.Symbol);

  public static List<CategoryGetDto> Map(IEnumerable<Category> domainModels)
    => domainModels.Select(Map).ToList();

  public static TagGetDto Map(TagGet domainModel)
    => new(domainModel.Id, domainModel.Name);

  public static List<TagGetDto> Map(IEnumerable<TagGet> domainModels)
    => domainModels.Select(Map).ToList();

  public static RecipeGetDto Map(RecipeGet domainModel, string imageSrcBaseUrl)
    => new(
      domainModel.Id,
      domainModel.Name,
      Map(domainModel.Category),
      Map(domainModel.Tags),
      domainModel.ImageSrc.HasValue ? $"{imageSrcBaseUrl}{domainModel.ImageSrc.Value}" : null);

  public static List<RecipeGetDto> Map(IEnumerable<RecipeGet> domainModels, string imageSrcBaseUrl)
    => domainModels.Select(dm => Map(dm, imageSrcBaseUrl)).ToList();

  public static ShoppingListGetDto Map(ShoppingList domainModel)
    => new(domainModel.Id, domainModel.Name, domainModel.CreationDate, domainModel.UpdateDate);

  public static List<ShoppingListGetDto> Map(IEnumerable<ShoppingList> domainModels)
    => domainModels.Select(Map).ToList();

  public static AmountDto Map(Amount domainModel)
    => new(domainModel.Value.GetValueOrDefault(), domainModel.Unit.GetValueOrDefault());

  public static QuantifiableItemGetDto Map(QuantifiableItemGet domainModel) 
    => new(
      domainModel.Id, 
      domainModel.Name,
    Map(domainModel.Amount), 
      domainModel.Checked);
  
  public static List<QuantifiableItemGetDto> Map(IEnumerable<QuantifiableItemGet> domainModels) 
    => domainModels.Select(Map).ToList();

  public static RecipeDetailsGetDto Map(RecipeDetailsGet domainModel, string imageSrcBaseUrl) =>
    new(
      domainModel.Id,
      domainModel.Name,
      Map(domainModel.Category),
      Map(domainModel.Tags),
      domainModel.ImageSrc.HasValue ? $"{imageSrcBaseUrl}{domainModel.ImageSrc.Value}" : null,
      domainModel.Description,
      Map(domainModel.Ingredients),
      domainModel.CreationDate,
      domainModel.UpdateDate);

  public static ShoppingSublistGetDto Map(ShoppingSublist domainModel) => 
    new(domainModel.Id, domainModel.Name, domainModel.RecipeId.GetValueOrDefault(), domainModel.Count, Map(domainModel.Items));
  
  public static List<ShoppingSublistGetDto> Map(IEnumerable<ShoppingSublist> domainModels) 
    => domainModels.Select(Map).ToList();

  public static ShoppingListDetailsGetDto Map(ShoppingListDetails domainModel) 
    => new(
      domainModel.Id, 
      domainModel.Name, 
      domainModel.CreationDate, 
      domainModel.UpdateDate, 
      Map(domainModel.Sublists));

  public static Amount Map(AmountDto dto) => new(dto.Value, dto.Unit);
  
  public static Amount Map(AmountCreateDto dto) => new(dto.Value, dto.Unit);

  public static QuantifiableItemCreate Map(QuantifiableItemCreateDto dto) => new(dto.Name, Map(dto.Amount));

  public static List<QuantifiableItemCreate> Map(IEnumerable<QuantifiableItemCreateDto> dtos) 
    => dtos.Select(Map).ToList();

  public static TagCreate Map(TagCreateDto dto) => new(dto.Name);

  public static List<TagCreate> Map(IEnumerable<TagCreateDto> dtos) => dtos.Select(Map).ToList();

  public static RecipeCreate Map(RecipeCreateDto dto)
    => new(
      dto.Name, 
      dto.CategoryId, 
      dto.TagIds ?? [], 
      dto.NewTags != null ? Map(dto.NewTags) : [],
      Maybe<IFormFile>.From(dto.Image), 
      dto.Description ?? "", 
      dto.Ingredients != null ? Map(dto.Ingredients) : []);

  public static ShoppingListUpdate Map(ShoppingListUpdateDto dto)
  {
    var model = new ShoppingListUpdate(dto.Name, dto.Sublists.Select(MapSublistUpdate).ToList());
    return model;

    ShoppingSublistUpdate MapSublistUpdate(ShoppingSublistUpdateDto dto)
    {
      return new ShoppingSublistUpdate(dto.Id, dto.Count, dto.Items.Select(MapShoppingListItem).ToList());
    }

    ShoppingListItemUpdate MapShoppingListItem(ShoppingListItemUpdateDto dto)
    {
      return new ShoppingListItemUpdate(dto.Id, dto.Name, Map(dto.Amount), dto.Checked);
    }
  }

  public static GetRecipesQueryParams Map(GetRecipesQueryParamsDto dto)
  {
    var filtering = dto.Name != null || dto.Category != null || dto.Tags != null
      ? new Filtering(dto.Name, dto.Category, dto.Tags ?? [])
      : null;
    
    var paging = new Paging(dto.LastName ?? "", dto.LastId ?? 0, dto.PageSize);

    return new GetRecipesQueryParams(filtering, paging);
  }
}