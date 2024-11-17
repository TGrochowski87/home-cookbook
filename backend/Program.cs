using System.Diagnostics;
using Cookbook.DataAccess;
using Cookbook.Extensions;
using FluentValidation;
using Microsoft.AspNetCore.HttpLogging;
using OpenTelemetry.Metrics;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;

var builder = WebApplication.CreateBuilder(args);

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
  logging.RequestBodyLogLimit = 4096;
  logging.ResponseBodyLogLimit = 4096;
});

builder.Services.AddOpenTelemetry()
  .WithMetrics(builder =>
  {
    builder.AddPrometheusExporter();

    builder.AddMeter("Microsoft.AspNetCore.Hosting",
      "Microsoft.AspNetCore.Server.Kestrel");
    builder.AddView("http.server.request.duration",
      new ExplicitBucketHistogramConfiguration
      {
        Boundaries =
        [
          0, 0.005, 0.01, 0.025, 0.05,
          0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10
        ]
      });
  });

builder.Services.AddProblemDetails(options =>
{
  options.CustomizeProblemDetails = (context) =>
  {
    if (context.ProblemDetails.Extensions.ContainsKey("traceId") == false)
    {
      context.ProblemDetails.Extensions.Add("traceId", Activity.Current?.Id ?? context.HttpContext.TraceIdentifier);
    }
  };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => { options.SupportNonNullableReferenceTypes(); });

builder.Services.AddCors(options =>
{
  options.AddPolicy("dev", policy =>
  {
    policy.WithOrigins("http://192.168.0.164:5173")
      .AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials();
  });
});

// TODO: Add caching
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

if (app.Environment.IsDevelopment())
{
  app.UseCors("dev");
}

// TODO
// app.UseAntiforgery();

app.MapPrometheusScrapingEndpoint();

app.AddAllEndpoints()
  .UsePerRequestTransaction()
  .Run();