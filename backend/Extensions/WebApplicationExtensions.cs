using Cookbook.Contracts;

namespace Cookbook.Extensions;

public static class WebApplicationExtensions
{
    /// <summary>
    /// Adds all endpoint definitions from implementations of <see cref="IEndpointsDefinition"/> to the provided
    /// WebApplication instance.
    /// </summary>
    /// <param name="app">The WebApplication instance to add endpoints to.</param>
    /// <returns>The WebApplication instance with all endpoints added.</returns>
    public static WebApplication AddAllEndpoints(this WebApplication app)
    {
        var assembly = typeof(WebApplicationExtensions).Assembly;
        var endpointsDefinitions = assembly.ExportedTypes
            .Where(t => typeof(IEndpointsDefinition).IsAssignableFrom(t) && t.IsAbstract == false)
            .Select(Activator.CreateInstance)
            .Cast<IEndpointsDefinition>();

        foreach (var definition in endpointsDefinitions)
        {
            definition.MapEndpoints(app);
        }
        
        return app;
    }
}