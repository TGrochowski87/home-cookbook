using Microsoft.EntityFrameworkCore;

namespace Cookbook.DataAccess;

internal partial class CookbookContext : DbContext
{
    public CookbookContext()
    {
    }

    public CookbookContext(DbContextOptions<CookbookContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<List> Lists { get; set; }

    public virtual DbSet<QuantifiableItem> QuantifiableItems { get; set; }

    public virtual DbSet<Recipe> Recipes { get; set; }

    public virtual DbSet<ShoppingList> ShoppingLists { get; set; }

    public virtual DbSet<ShoppingSublist> ShoppingSublists { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:Cookbook");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("categories_pkey");

            entity.ToTable("categories");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Color)
                .HasMaxLength(7)
                .HasColumnName("color");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<List>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("lists_pkey");

            entity.ToTable("lists");

            entity.Property(e => e.Id).HasColumnName("id");
        });

        modelBuilder.Entity<QuantifiableItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("quantifiable_items_pkey");

            entity.ToTable("quantifiable_items");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Checked).HasColumnName("checked");
            entity.Property(e => e.ListId).HasColumnName("list_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Unit)
                .HasMaxLength(10)
                .HasColumnName("unit");
            entity.Property(e => e.Value)
                .HasMaxLength(20)
                .HasColumnName("value");

            entity.HasOne(d => d.List).WithMany(p => p.QuantifiableItems)
                .HasForeignKey(d => d.ListId)
                .HasConstraintName("fk_list");
        });

        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("recipes_pkey");

            entity.ToTable("recipes");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ImageSrc)
                .HasMaxLength(2048)
                .HasColumnName("image_src");
            entity.Property(e => e.ListId).HasColumnName("list_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.HasOne(d => d.Category).WithMany(p => p.Recipes)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("fk_category");

            entity.HasOne(d => d.List).WithMany(p => p.Recipes)
                .HasForeignKey(d => d.ListId)
                .HasConstraintName("fk_list");

            entity.HasMany(d => d.Tags).WithMany(p => p.Recipes)
                .UsingEntity<Dictionary<string, object>>(
                    "RecipesTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .HasConstraintName("fk_tag"),
                    l => l.HasOne<Recipe>().WithMany()
                        .HasForeignKey("RecipeId")
                        .HasConstraintName("fk_recipe"),
                    j =>
                    {
                        j.HasKey("RecipeId", "TagId").HasName("recipes_tags_pkey");
                        j.ToTable("recipes_tags");
                        j.IndexerProperty<int>("RecipeId").HasColumnName("recipe_id");
                        j.IndexerProperty<int>("TagId").HasColumnName("tag_id");
                    });
        });

        modelBuilder.Entity<ShoppingList>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("shopping_lists_pkey");

            entity.ToTable("shopping_lists");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Creationdate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("creationdate");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Updatedate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedate");
        });

        modelBuilder.Entity<ShoppingSublist>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("shopping_sublists_pkey");

            entity.ToTable("shopping_sublists");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Count).HasColumnName("count");
            entity.Property(e => e.ListId).HasColumnName("list_id");
            entity.Property(e => e.RecipeId).HasColumnName("recipe_id");
            entity.Property(e => e.ShoppingListId).HasColumnName("shopping_list_id");

            entity.HasOne(d => d.List).WithMany(p => p.ShoppingSublists)
                .HasForeignKey(d => d.ListId)
                .HasConstraintName("fk_list");

            entity.HasOne(d => d.Recipe).WithMany(p => p.ShoppingSublists)
                .HasForeignKey(d => d.RecipeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_recipe");

            entity.HasOne(d => d.ShoppingList).WithMany(p => p.ShoppingSublists)
                .HasForeignKey(d => d.ShoppingListId)
                .HasConstraintName("fk_shopping_list");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tags_pkey");

            entity.ToTable("tags");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
