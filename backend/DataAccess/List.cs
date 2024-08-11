namespace Cookbook.DataAccess;

internal partial class List
{
  public int Id { get; set; }

  public virtual ICollection<QuantifiableItem> QuantifiableItems { get; set; } = new List<QuantifiableItem>();

  public virtual ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();

  public virtual ICollection<ShoppingSublist> ShoppingSublists { get; set; } = new List<ShoppingSublist>();
}