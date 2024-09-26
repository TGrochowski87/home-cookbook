namespace Cookbook.DataAccess;

internal partial class Recipe
{
  public int Id { get; set; }

  public int CategoryId { get; set; }

  public int ListId { get; set; }

  public string Name { get; set; } = null!;

  public string Description { get; set; } = null!;

  public string? ImageSrc { get; set; }

  public virtual Category Category { get; set; } = null!;

  public virtual List List { get; set; } = null!;

  public virtual ICollection<ShoppingSublist> ShoppingSublists { get; set; } = new List<ShoppingSublist>();

  public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}