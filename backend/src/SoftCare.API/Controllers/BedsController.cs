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
public class BedsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public BedsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetBeds()
    {
        var beds = await _context.Beds.Where(b => b.IsActive).OrderBy(b => b.RoomNumber).ToListAsync();
        return Ok(beds.Select(b => new
        {
            id = b.Id,
            roomNumber = b.RoomNumber,
            bedNumber = b.BedNumber,
            departmentId = b.DepartmentId,
            type = b.Type,
            status = b.Status,
            currentPatientId = b.CurrentPatientId,
            currentAdmissionId = b.CurrentAdmissionId,
            dailyRate = b.DailyRate
        }));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateBed(string id, [FromBody] Bed updates)
    {
        var bed = await _context.Beds.FirstOrDefaultAsync(b => b.Id == id);
        if (bed == null) return NotFound();

        bed.Status = updates.Status ?? bed.Status;
        bed.CurrentPatientId = updates.CurrentPatientId;
        bed.CurrentAdmissionId = updates.CurrentAdmissionId;
        bed.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(bed);
    }
}
