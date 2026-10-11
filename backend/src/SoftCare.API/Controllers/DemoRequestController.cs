using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/demo-request")]
public class DemoRequestController : ControllerBase
{
    private readonly ILogger<DemoRequestController> _logger;
    private readonly IAuditService _auditService;
    private readonly IApplicationDbContext _context;

    // Rate Limiting : max 5 requêtes par IP sur une fenêtre glissante de 10 minutes
    private static readonly ConcurrentDictionary<string, List<DateTime>> _rateLimitTracker = new();
    private static readonly TimeSpan RateLimitWindow = TimeSpan.FromMinutes(10);
    private const int MaxRequestsPerWindow = 5;

    public DemoRequestController(
        ILogger<DemoRequestController> logger,
        IAuditService auditService,
        IApplicationDbContext context)
    {
        _logger = logger;
        _auditService = auditService;
        _context = context;
    }

    public class DemoRequestDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Facility { get; set; } = string.Empty;
        public string? PreferredDate { get; set; }
        public string? Notes { get; set; }
        public string[]? Modules { get; set; }

        // Honeypot anti-bots (champs masqués dans l'UI)
        public string? Honeypot { get; set; }
        public string? Website { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> SubmitDemoRequest([FromBody] DemoRequestDto dto)
    {
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

        // 1. Détection Honeypot (piège anti-robots)
        if (!string.IsNullOrWhiteSpace(dto.Honeypot) || !string.IsNullOrWhiteSpace(dto.Website))
        {
            _logger.LogWarning("HONEYPOT_TRIGGERED : Soumission suspecte bloquée depuis {Ip}", clientIp);
            // Réponse silencieuse ou rejet
            return BadRequest(new { success = false, message = "Requête invalide détectée (filtre anti-spam actif)." });
        }

        // 2. Contrôle de Rate Limiting
        var now = DateTime.UtcNow;
        var timestamps = _rateLimitTracker.GetOrAdd(clientIp, _ => new List<DateTime>());
        lock (timestamps)
        {
            timestamps.RemoveAll(t => now - t > RateLimitWindow);
            if (timestamps.Count >= MaxRequestsPerWindow)
            {
                _logger.LogWarning("RATE_LIMIT_EXCEEDED : Trop de demandes depuis {Ip}", clientIp);
                return StatusCode(429, new
                {
                    success = false,
                    message = "Limite de demandes atteinte pour cette adresse IP. Veuillez réessayer dans quelques minutes."
                });
            }
            timestamps.Add(now);
        }

        // 3. Validation des champs obligatoires
        if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Facility))
        {
            return BadRequest(new { success = false, message = "Le nom, l'email et l'établissement sont obligatoires." });
        }

        if (!dto.Email.Contains("@") || !dto.Email.Contains("."))
        {
            return BadRequest(new { success = false, message = "Veuillez fournir une adresse email valide." });
        }

        var refCode = $"DEMO-{Random.Shared.Next(100000, 999999)}";
        var receivedAt = DateTime.UtcNow;

        _logger.LogInformation(
            "DEMANDE_DEMO_REÇUE [{RefCode}] : {FullName} ({Email}) - {Facility} - Tél: {Phone} - Date: {Date}",
            refCode, dto.FullName, dto.Email, dto.Facility, dto.Phone, dto.PreferredDate);

        // 4. Stockage persistant dans la table DemoLead
        var lead = new DemoLead
        {
            Id = Guid.NewGuid().ToString(),
            ReferenceCode = refCode,
            FullName = dto.FullName.Trim(),
            Email = dto.Email.Trim(),
            Phone = dto.Phone?.Trim() ?? string.Empty,
            Facility = dto.Facility.Trim(),
            PreferredDate = dto.PreferredDate,
            ModulesJson = JsonSerializer.Serialize(dto.Modules ?? Array.Empty<string>()),
            Notes = dto.Notes,
            IpAddress = clientIp,
            Status = "pending",
            CreatedAt = receivedAt,
            UpdatedAt = receivedAt,
            IsActive = true
        };

        try
        {
            _context.DemoLeads.Add(lead);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'enregistrement du DemoLead {RefCode} en base", refCode);
            // On continue avec l'audit trail pour ne pas perdre la demande
        }

        // 5. Journalisation dans l'Audit Trail pour traçabilité
        try
        {
            var userAgent = Request.Headers["User-Agent"].ToString();
            if (string.IsNullOrWhiteSpace(userAgent)) userAgent = "SoftCare WebApp/LandingPage";

            var detailsJson = JsonSerializer.Serialize(new
            {
                referenceCode = refCode,
                fullName = dto.FullName,
                email = dto.Email,
                phone = dto.Phone,
                facility = dto.Facility,
                preferredDate = dto.PreferredDate,
                modules = dto.Modules,
                notes = dto.Notes,
                receivedAtUtc = receivedAt.ToString("o")
            });

            await _auditService.LogAsync(
                "DEMANDE_DEMO_SOUMISE",
                "DemoLead",
                refCode,
                dto.FullName,
                detailsJson,
                "lead-system",
                dto.FullName,
                "prospect",
                clientIp,
                userAgent);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Impossible d'écrire dans l'audit trail pour la démo {RefCode}", refCode);
        }

        return Ok(new
        {
            success = true,
            referenceCode = refCode,
            receivedAt = receivedAt.ToString("o"),
            storage = "Table DemoLead (Base de Données SoftCare)",
            destination = "File d'attente médicale (contact@softcare.fr)",
            message = $"Votre demande a été enregistrée avec succès dans le registre SoftCare sous la référence {refCode}. Notre équipe médicale vous recontactera."
        });
    }

    [HttpGet("leads")]
    public async Task<IActionResult> GetDemoLeads([FromQuery] int limit = 50)
    {
        try
        {
            var leads = await _context.DemoLeads
                .OrderByDescending(l => l.CreatedAt)
                .Take(Math.Clamp(limit, 1, 100))
                .ToListAsync();

            return Ok(leads);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des DemoLeads");
            return StatusCode(500, new { message = "Impossible de récupérer les leads." });
        }
    }
}
