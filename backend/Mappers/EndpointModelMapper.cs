using Cookbook.Contracts.Categories;
using Cookbook.Contracts.Common;
using Cookbook.Contracts.Recipes;
using Cookbook.Contracts.ShoppingLists;
using Cookbook.Contracts.Tags;
using Cookbook.Features.Common.Models;
using Cookbook.Features.Recipes;
using Cookbook.Features.ShoppingLists;
using Cookbook.Features.Tags;
using CSharpFunctionalExtensions;
using Category = Cookbook.Features.Categories.Category;
using QuantifiableItemGet = Cookbook.Features.Common.Models.QuantifiableItemGet;
using RecipeGet = Cookbook.Features.Recipes.RecipeGet;
using ShoppingList = Cookbook.Features.ShoppingLists.ShoppingList;
using TagGet = Cookbook.Features.Tags.TagGet;

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

  public static RecipeGetDto Map(RecipeGet domainModel)
    => new(
      domainModel.Id,
      domainModel.Name,
      Map(domainModel.Category),
      Map(domainModel.Tags),
      domainModel.ImageSrc.GetValueOrDefault());

  public static List<RecipeGetDto> Map(IEnumerable<RecipeGet> domainModels)
    => domainModels.Select(Map).ToList();

  public static ShoppingListGetDto Map(ShoppingList domainModel)
    => new(domainModel.Id, domainModel.Name, domainModel.CreationDate, domainModel.UpdateDate);

  public static List<ShoppingListGetDto> Map(IEnumerable<ShoppingList> domainModels)
    => domainModels.Select(Map).ToList();

  public static AmountDto Map(Amount domainModel)
    => new(domainModel.Value, domainModel.Unit.GetValueOrDefault());

  public static QuantifiableItemGetDto Map(QuantifiableItemGet domainModel) 
    => new(
      domainModel.Id, 
      domainModel.Name,
    Map(domainModel.Amount), 
      domainModel.Checked);
  
  public static List<QuantifiableItemGetDto> Map(IEnumerable<QuantifiableItemGet> domainModels) 
    => domainModels.Select(Map).ToList();

  public static RecipeDetailsGetDto Map(RecipeDetailsGet domainModel)
    => new(
      domainModel.Id,
      domainModel.Name,
      Map(domainModel.Category),
      Map(domainModel.Tags),
      domainModel.ImageSrc.GetValueOrDefault(),
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