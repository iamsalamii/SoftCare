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
public class EmergencyController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public EmergencyController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetEmergencyVisits()
    {
        var visits = await _context.EmergencyVisits
            .Where(e => e.IsActive)
            .OrderBy(e => e.TriageLevel)
            .ThenByDescending(e => e.ArrivalTime)
            .ToListAsync();

        return Ok(visits);
    }

    [HttpPost]
    public async Task<ActionResult> CreateEmergencyVisit([FromBody] EmergencyVisit visit)
    {
        visit.Id = Guid.NewGuid().ToString();
        visit.ArrivalTime = DateTime.SpecifyKind(visit.ArrivalTime, DateTimeKind.Utc);
        visit.TriageTime = DateTime.SpecifyKind(visit.TriageTime, DateTimeKind.Utc);
        _context.EmergencyVisits.Add(visit);
        await _context.SaveChangesAsync();
        return Ok(visit);
    }
}
