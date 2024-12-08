using System.Diagnostics;
using Cookbook.DataAccess;
using Cookbook.Extensions;
using FluentValidation;
using Microsoft.AspNetCore.HttpLogging;
using OpenTelemetry.Metrics;
using Serilog;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Host.UseSerilog((context, loggerConfig) =>
{
  loggerConfig.ReadFrom.Configuration(context.Configuration);
});

builder.Logging.AddSimpleConsole(options =>
{
  options.TimestampFormat = "[HH:mm:ss] ";
});
builder.Services.AddHttpLogging(logging =>
{
  logging.LoggingFields = HttpLoggingFields.RequestPropertiesAndHeaders | HttpLoggingFields.RequestQuery |
                          HttpLoggingFields.RequestBody | HttpLoggingFields.ResponsePropertiesAndHeaders |
                          HttpLoggingFields.ResponseBody | HttpLoggingFields.Duration;
  logging.MediaTypeOptions.AddText("application/json");
  logging.CombineLogs = true;
  logging.RequestBodyLogLimit = 4096;
  logging.ResponseBodyLogLimit = 4096;
});

builder.Services.AddMetrics();
builder.Services.AddOpenTelemetry()
  .WithMetrics(config =>
  {
    config.AddPrometheusExporter();

    config.AddMeter("Microsoft.AspNetCore.Hosting",
      "Microsoft.AspNetCore.Server.Kestrel",
      "cookbook.crash.analytics");
    config.AddView("http.server.request.duration",
      new ExplicitBucketHistogramConfiguration
      {
        Boundaries =
        [
          0, 0.005, 0.01, 0.025, 0.05,
          0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10
        ]
      });
  });

builder.Services.AddHealthChecks()
  .AddDbContextCheck<CookbookContext>();

builder.Services.AddProblemDetails(options =>
{
  options.CustomizeProblemDetails = context =>
  {
    if (context.ProblemDetails.Extensions.ContainsKey("traceId") == false)
    {
      context.ProblemDetails.Extensions.Add("traceId", Activity.Current?.TraceId.ToString() ?? context.HttpContext.TraceIdentifier);
    }
  };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => { options.SupportNonNullableReferenceTypes(); });

builder.Services.AddCors(options =>
{
  options.AddPolicy("cors", policy =>
  {
    policy.WithOrigins(builder.Configuration.GetRequiredSection("AllowedOrigins").Get<string[]>()!)
      .AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials();
  });
});

builder.Services
  // .AddAntiforgery()
  .AddDbContext<CookbookContext>()
  .AddScopedSingleImplementationServices()
  .AddValidatorsFromAssembly(typeof(Program).Assembly)
  .AddFluentValidationAutoValidation();

var app = builder.Build();

app.UseHttpLogging();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("cors");

// TODO
// app.UseAntiforgery();

app.MapPrometheusScrapingEndpoint();
app.MapHealthChecks("health");
app.AddAllEndpoints()
  .UseCrashAnalytics()
  .UsePerRequestTransaction()
  .Run();