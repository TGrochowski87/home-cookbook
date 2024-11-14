using Cookbook.Contracts;
using Cookbook.DataAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

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

  /// <summary>
  /// TODO
  /// </summary>
  /// <param name="app"></param>
  /// <returns></returns>
  public static WebApplication UsePerRequestTransaction(this WebApplication app)
  {
    app.Use(async (context, next) =>
    {
      using var transaction = new CookbookTransaction(context.RequestServices.GetRequiredService<CookbookContext>());

      await next(context);

      if(context.Response.StatusCode is >= 200 and < 300)
      {
        transaction.Commit();
      }
      else
      {
        var logger = context.RequestServices.GetRequiredService<ILogger<CookbookTransaction>>();
        logger.LogWarning("Response status code is {StatusCode}. Rolling back transaction.", context.Response.StatusCode);
        transaction.Rollback();
      }  
    });

    return app;
  }
}