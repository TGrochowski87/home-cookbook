namespace Cookbook.DataAccess;

internal partial class Tag
{
  public int Id { get; set; }

  public string Name { get; set; } = null!;

  public virtual ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
}