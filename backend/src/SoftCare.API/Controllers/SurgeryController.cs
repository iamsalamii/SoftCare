using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SurgeryController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public SurgeryController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetSurgeries()
    {
        var surgeries = await _context.Surgeries
            .Where(s => s.IsActive)
            .OrderByDescending(s => s.ScheduledDate)
            .ToListAsync();
        return Ok(surgeries);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetSurgery(string id)
    {
        var surgery = await _context.Surgeries.FindAsync(id);
        if (surgery == null || !surgery.IsActive)
            return NotFound();
        return Ok(surgery);
    }

    [HttpPost]
    public async Task<ActionResult> CreateSurgery([FromBody] Surgery surgery)
    {
        surgery.Id = Guid.NewGuid().ToString();
        surgery.CreatedAt = DateTime.UtcNow;
        surgery.UpdatedAt = DateTime.UtcNow;
        surgery.IsActive = true;

        _context.Surgeries.Add(surgery);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSurgery), new { id = surgery.Id }, surgery);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateSurgery(string id, [FromBody] Surgery updates)
    {
        var surgery = await _context.Surgeries.FindAsync(id);
        if (surgery == null || !surgery.IsActive)
            return NotFound();

        surgery.PatientId = updates.PatientId;
        surgery.AdmissionId = updates.AdmissionId;
        surgery.ScheduledDate = updates.ScheduledDate;
        surgery.ScheduledTime = updates.ScheduledTime;
        surgery.DurationMinutes = updates.DurationMinutes;
        surgery.Type = updates.Type;
        surgery.Procedure = updates.Procedure;
        surgery.SurgeonId = updates.SurgeonId;
        surgery.AnesthesiologistId = updates.AnesthesiologistId;
        surgery.OperatingRoomId = updates.OperatingRoomId;
        surgery.Status = updates.Status;
        surgery.AnesthesiaType = updates.AnesthesiaType;
        surgery.PreOpDiagnosis = updates.PreOpDiagnosis;
        surgery.PostOpDiagnosis = updates.PostOpDiagnosis;
        surgery.StartTime = updates.StartTime;
        surgery.EndTime = updates.EndTime;
        
        surgery.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(surgery);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSurgery(string id)
    {
        var surgery = await _context.Surgeries.FindAsync(id);
        if (surgery == null || !surgery.IsActive)
            return NotFound();

        surgery.IsActive = false;
        surgery.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SettingsController : BaseApiController
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public SettingsController(IApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    [HttpGet("organization")]
    public async Task<ActionResult> GetOrganizationSettings()
    {
        var settings = await _context.OrganizationSettings.FirstOrDefaultAsync();
        return Ok(settings);
    }

    [HttpPut("organization")]
    public async Task<ActionResult> UpdateOrganizationSettings([FromBody] OrganizationSetting updates)
    {
        var settings = await _context.OrganizationSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            _context.OrganizationSettings.Add(updates);
            settings = updates;
        }
        else
        {
            settings.Name = updates.Name;
            settings.Address = updates.Address;
            settings.Phone = updates.Phone;
            settings.Email = updates.Email;
            settings.Currency = updates.Currency;
            settings.CurrencySymbol = updates.CurrencySymbol;
            settings.TaxRate = updates.TaxRate;
            settings.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        // Audit Trail
        await LogAuditAsync(
            _auditService,
            "MODIFICATION_PARAMETRES_ETABLISSEMENT",
            "OrganizationSettings",
            "ORG-SETTINGS",
            "Établissement Global",
            $"{{\"name\":\"{settings.Name}\",\"currency\":\"{settings.Currency}\"}}");

        return Ok(settings);
    }
}
