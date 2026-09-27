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
public class AdmissionsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AdmissionsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetAdmissions([FromQuery] string? patientId = null)
    {
        var query = _context.Admissions.Where(a => a.IsActive);

        if (!string.IsNullOrEmpty(patientId))
        {
            query = query.Where(a => a.PatientId == patientId);
        }

        var list = await query.OrderByDescending(a => a.AdmissionDate).ToListAsync();
        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult> CreateAdmission([FromBody] Admission admission)
    {
        admission.Id = Guid.NewGuid().ToString();
        admission.AdmissionDate = DateTime.SpecifyKind(admission.AdmissionDate, DateTimeKind.Utc);
        
        if (admission.ExpectedDischargeDate.HasValue)
        {
            admission.ExpectedDischargeDate = DateTime.SpecifyKind(admission.ExpectedDischargeDate.Value, DateTimeKind.Utc);
        }

        _context.Admissions.Add(admission);
        await _context.SaveChangesAsync();
        return Ok(admission);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAdmission(string id, [FromBody] Admission updates)
    {
        var admission = await _context.Admissions.FirstOrDefaultAsync(a => a.Id == id);
        if (admission == null) return NotFound();

        admission.Status = updates.Status ?? admission.Status;
        admission.BedId = updates.BedId ?? admission.BedId;
        admission.DepartmentId = updates.DepartmentId ?? admission.DepartmentId;
        admission.Notes = updates.Notes;
        admission.Reason = updates.Reason ?? admission.Reason;
        admission.UpdatedAt = DateTime.UtcNow;

        if (updates.ExpectedDischargeDate.HasValue)
        {
            admission.ExpectedDischargeDate = DateTime.SpecifyKind(updates.ExpectedDischargeDate.Value, DateTimeKind.Utc);
        }

        if (updates.ActualDischargeDate.HasValue)
        {
            admission.ActualDischargeDate = DateTime.SpecifyKind(updates.ActualDischargeDate.Value, DateTimeKind.Utc);
        }

        await _context.SaveChangesAsync();
        return Ok(admission);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAdmission(string id)
    {
        var admission = await _context.Admissions.FirstOrDefaultAsync(a => a.Id == id);
        if (admission == null) return NotFound();

        admission.IsActive = false;
        admission.Status = "cancelled";
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
