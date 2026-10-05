using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using SoftCare.Infrastructure;
using SoftCare.Infrastructure.Persistence;

// 0. Automatically discover and load local unversioned .env file if present
var currentDir = Directory.GetCurrentDirectory();
var envPath = Path.Combine(currentDir, ".env");
if (!File.Exists(envPath))
{
    var parent = Directory.GetParent(currentDir)?.Parent?.Parent?.FullName;
    if (parent != null && File.Exists(Path.Combine(parent, ".env")))
    {
        envPath = Path.Combine(parent, ".env");
    }
}
if (File.Exists(envPath))
{
    foreach (var line in File.ReadAllLines(envPath))
    {
        var trimmed = line.Trim();
        if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith("#")) continue;
        var parts = trimmed.Split('=', 2);
        if (parts.Length == 2 && Environment.GetEnvironmentVariable(parts[0].Trim()) == null)
        {
            Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
        }
    }
}

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure Services (PostgreSQL / EF Core, JWT)
builder.Services.AddInfrastructure(builder.Configuration);

// Add SignalR for real-time alerts
builder.Services.AddSignalR();

// 2. Add Controllers with JSON configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 3. Configure CORS with strict production domain support
var corsOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries)
    ?? new[] { "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:5174" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                try
                {
                    var uri = new Uri(origin);
                    return uri.Host == "localhost" 
                        || uri.Host == "127.0.0.1" 
                        || uri.Host.EndsWith(".vercel.app") 
                        || Array.Exists(corsOrigins, o => o.TrimEnd('/') == origin.TrimEnd('/'));
                }
                catch
                {
                    return false;
                }
            })
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

// 4.5. Configure Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("LoginPolicy", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });
    options.RejectionStatusCode = 429;
});

var app = builder.Build();

// 5. Database Initialization & Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();
        await DatabaseSeeder.SeedAsync(context);
        Console.WriteLine("--> [SoftCare] Base de données initialisée et données de référence insérées avec succès.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> [SoftCare] Note sur l'initialisation DB: {ex.Message}");
    }
}

// 6. HTTP Pipeline Configuration (Security & Error Masking)
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/api/error");
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("EnableSwaggerInProduction"))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SoftCare API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseRouting();

app.UseRateLimiter();

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
app.MapHub<SoftCare.API.Hubs.HospitalHub>("/hubs/hospital");

app.Run();
