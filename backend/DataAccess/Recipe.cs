namespace Cookbook.DataAccess;

internal partial class Recipe
{
    public int Id { get; set; }

    public int? CategoryId { get; set; }

    public int? ListId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? ImageSrc { get; set; }

    public virtual Category? Category { get; set; }

    public virtual List? List { get; set; }

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
