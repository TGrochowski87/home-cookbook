namespace Cookbook.DataAccess;

internal partial class ShoppingList
{
  public int Id { get; set; }

  public string Name { get; set; } = null!;

  public DateTime Creationdate { get; set; }

  public DateTime Updatedate { get; set; }

  public virtual ICollection<ShoppingSublist> ShoppingSublists { get; set; } = new List<ShoppingSublist>();
}