using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SoftCare.Application.Common.Interfaces;

namespace SoftCare.API.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/demo-request")]
public class DemoRequestController : ControllerBase
{
    private readonly ILogger<DemoRequestController> _logger;
    private readonly IAuditService _auditService;

    public DemoRequestController(ILogger<DemoRequestController> logger, IAuditService auditService)
    {
        _logger = logger;
        _auditService = auditService;
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
    }

    [HttpPost]
    public async Task<IActionResult> SubmitDemoRequest([FromBody] DemoRequestDto dto)
    {
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
            "DEMANDE_DEMO_REÇUE [{RefCode}] : {FullName} ({Email}) - {Facility} - Tél: {Phone} - Date souhaitée: {Date}",
            refCode, dto.FullName, dto.Email, dto.Facility, dto.Phone, dto.PreferredDate);

        // Journalisation dans l'Audit Trail pour visibilité administrative
        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
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
                ip,
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
            destination = "Direction Médicale & Déploiement SoftCare (contact@softcare.fr)",
            message = "Votre demande de démonstration personnalisée a été transmise à notre équipe médicale."
        });
    }
}
