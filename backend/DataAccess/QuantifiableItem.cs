namespace Cookbook.DataAccess;

internal partial class QuantifiableItem
{
    public int Id { get; set; }

    public int? ListId { get; set; }

    public string Name { get; set; } = null!;

    public string Value { get; set; } = null!;

    public string? Unit { get; set; }

    public bool Checked { get; set; }

    public virtual List? List { get; set; }
}
