using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using SoftCare.Infrastructure;
using SoftCare.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure Services (PostgreSQL / EF Core, JWT)
builder.Services.AddInfrastructure(builder.Configuration);

// 2. Add Controllers with JSON configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 3. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://localhost:5174")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// 4. Configure Swagger / OpenAPI with JWT Bearer
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SoftCare Hospital Management & Biotech API",
        Version = "v1",
        Description = "API REST de gestion hospitalière, pharmacie avancée et biotechnologies (PGx, Biobanque)."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Entrez 'Bearer' suivi d'un espace et de votre token JWT.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 5. Database Initialization & Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        // EnsureCreated or Migrate
        context.Database.EnsureCreated();
        await DatabaseSeeder.SeedAsync(context);
        Console.WriteLine("--> [SoftCare] Base de données initialisée et données de référence insérées avec succès.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> [SoftCare] Note sur l'initialisation DB: {ex.Message}");
    }
}

// 6. HTTP Pipeline Configuration
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SoftCare API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Health Check Endpoint
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "healthy",
    application = "SoftCare Hospital Management System (.NET 9 + PostgreSQL)",
    timestamp = DateTime.UtcNow,
    features = new[] { "PGx", "Biobank LIMS", "Barcode/QR Engine", "Clinical Trials", "Pharmacy POS", "Admissions" }
}));

app.MapControllers();

app.Run();
