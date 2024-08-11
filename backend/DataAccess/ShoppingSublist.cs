namespace Cookbook.DataAccess;

internal partial class ShoppingSublist
{
    public int Id { get; set; }

    public int ShoppingListId { get; set; }

    public int ListId { get; set; }

    public int? RecipeId { get; set; }

    public int Count { get; set; }

    public virtual List List { get; set; } = null!;

    public virtual Recipe? Recipe { get; set; }

    public virtual ShoppingList ShoppingList { get; set; } = null!;
}
