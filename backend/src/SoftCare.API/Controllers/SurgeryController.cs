using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

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
}

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public SettingsController(IApplicationDbContext context)
    {
        _context = context;
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
        return Ok(settings);
    }
}
