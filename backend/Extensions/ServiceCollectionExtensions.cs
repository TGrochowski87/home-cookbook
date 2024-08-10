namespace Cookbook.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers with scoped lifetime all classes that are the only implementations of their interfaces to the
    /// provided IServiceCollection.
    /// </summary>
    /// <param name="services">The IServiceCollection instance to add services to.</param>
    /// <returns>The IServiceCollection instance with all services added.</returns>
    public static IServiceCollection AddScopedSingleImplementationServices(this IServiceCollection services)
    {
        var assembly = typeof(ServiceCollectionExtensions).Assembly;
        var allTypes = assembly.GetTypes();
        var interfaces = allTypes.Where(t => t.IsInterface).ToArray();
        foreach (var inter in interfaces)
        {
            var implementations = allTypes.Where(t => t.IsAssignableTo(inter) && t.IsAbstract == false).ToArray();
            if (implementations.Length != 1)
            {
                continue;
            }

            services.AddScoped(inter, implementations[0]);
        }

        return services;
    }
}