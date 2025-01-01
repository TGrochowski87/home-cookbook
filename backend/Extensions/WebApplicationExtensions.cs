using System.Diagnostics;
using System.Diagnostics.Metrics;
using Cookbook.Contracts;
using Cookbook.DataAccess;

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
  /// Wraps all requests in a transaction.
  /// It gets rolled back on non-200 responses.
  /// </summary>
  /// <param name="app">The WebApplication instance to add this middleware to.</param>
  /// <returns>The WebApplication instance with transaction middleware added.</returns>
  public static WebApplication UsePerRequestTransaction(this WebApplication app)
  {
    app.Use(async (context, next) =>
    {
      using var transaction = new CookbookTransaction(context.RequestServices.GetRequiredService<CookbookContext>());

      try
      {
        await next(context);

        if(context.Response.StatusCode is >= 200 and < 300)
        {
          transaction.Commit();
        }
        else
        {
          LogAndRollbackTransaction(context.RequestServices, transaction, context.Response.StatusCode);
        }  
      }
      catch (Exception)
      {
        LogAndRollbackTransaction(context.RequestServices, transaction, 500);
        throw;
      }
    });

    return app;
  }

  /// <summary>
  /// Adds a meter that counts unhandled exceptions.
  /// This can later be used by Grafana for alerting purposes.
  /// </summary>
  /// <param name="app">The WebApplication instance to add meter to.</param>
  /// <returns>he WebApplication instance with meter added.</returns>
  public static WebApplication UseCrashAnalytics(this WebApplication app)
  {
    app.Use(async (context, next) =>
    {
      try
      {
        await next(context);
      }
      catch (Exception)
      {
        var meterFactory = context.RequestServices.GetRequiredService<IMeterFactory>();
        var meter = meterFactory.Create("cookbook.crash.analytics");
        meter.CreateCounter<int>("unhandled_exceptions_counter").Add(1, tags: new []
        {
          new KeyValuePair<string, object?>("TraceId", Activity.Current?.TraceId.ToString() ?? context.TraceIdentifier)
        });
        
        throw;
      }
    });

    return app;
  }

  private static void LogAndRollbackTransaction(IServiceProvider services, CookbookTransaction transaction, int statusCode)
  {
    var logger = services.GetRequiredService<ILogger<CookbookTransaction>>();
    logger.LogWarning("Response status code is {StatusCode}. Rolling back transaction.", statusCode);
    transaction.Rollback();
  }
}