using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

public class UpdateAdmissionRequest
{
    public string? Status { get; set; }
    public string? BedId { get; set; }
    public string? DepartmentId { get; set; }
    public string? Reason { get; set; }
    public string? Notes { get; set; }
    public string? DischargeSummary { get; set; }
    public DateTime? ExpectedDischargeDate { get; set; }
    public DateTime? ActualDischargeDate { get; set; }
}

[Authorize]
public class AdmissionsController : BaseApiController
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public AdmissionsController(IApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
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
        admission.CreatedAt = DateTime.UtcNow;
        
        if (admission.ExpectedDischargeDate.HasValue)
        {
            admission.ExpectedDischargeDate = DateTime.SpecifyKind(admission.ExpectedDischargeDate.Value, DateTimeKind.Utc);
        }

        if (!string.IsNullOrEmpty(admission.BedId))
        {
            var bed = await _context.Beds.FindAsync(admission.BedId);
            if (bed != null)
            {
                if (bed.Status == "occupied" && bed.CurrentPatientId != admission.PatientId)
                {
                    return BadRequest(new { message = $"Le lit {bed.BedNumber} est déjà occupé." });
                }
                bed.Status = "occupied";
                bed.CurrentPatientId = admission.PatientId;
                bed.CurrentAdmissionId = admission.Id;
                bed.UpdatedAt = DateTime.UtcNow;
            }
        }

        _context.Admissions.Add(admission);
        await _context.SaveChangesAsync();

        // Audit Trail
        var patient = await _context.Patients.FindAsync(admission.PatientId);
        var patientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : admission.PatientId;
        await LogAuditAsync(
            _auditService,
            "ADMISSION_PATIENT",
            "Admission",
            admission.Id,
            patientName,
            $"{{\"bedId\":\"{admission.BedId}\",\"departmentId\":\"{admission.DepartmentId}\"}}");

        return Ok(admission);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAdmission(string id, [FromBody] UpdateAdmissionRequest updates)
    {
        var admission = await _context.Admissions.FirstOrDefaultAsync(a => a.Id == id);
        if (admission == null) return NotFound();

        // 1. Handle Bed Transfer if BedId is explicitly provided and different
        if (!string.IsNullOrWhiteSpace(updates.BedId) && updates.BedId != admission.BedId)
        {
            // Free current bed
            if (!string.IsNullOrEmpty(admission.BedId))
            {
                var oldBed = await _context.Beds.FindAsync(admission.BedId);
                if (oldBed != null && oldBed.CurrentAdmissionId == admission.Id)
                {
                    oldBed.Status = "available";
                    oldBed.CurrentPatientId = null;
                    oldBed.CurrentAdmissionId = null;
                    oldBed.UpdatedAt = DateTime.UtcNow;
                }
            }

            // Occupy target bed
            var newBed = await _context.Beds.FindAsync(updates.BedId);
            if (newBed != null)
            {
                if (newBed.Status == "occupied" && newBed.CurrentPatientId != admission.PatientId)
                {
                    return BadRequest(new { message = $"Le lit {newBed.BedNumber} est déjà occupé." });
                }
                newBed.Status = "occupied";
                newBed.CurrentPatientId = admission.PatientId;
                newBed.CurrentAdmissionId = admission.Id;
                newBed.UpdatedAt = DateTime.UtcNow;
            }
            admission.BedId = updates.BedId;
        }

        // 2. Handle Discharge Workflow
        if (updates.Status == "discharged")
        {
            admission.Status = "discharged";
            admission.ActualDischargeDate = updates.ActualDischargeDate.HasValue
                ? DateTime.SpecifyKind(updates.ActualDischargeDate.Value, DateTimeKind.Utc)
                : DateTime.UtcNow;

            // Free bed by bedId or by CurrentAdmissionId
            var bed = !string.IsNullOrEmpty(admission.BedId)
                ? await _context.Beds.FindAsync(admission.BedId)
                : null;

            if (bed == null)
            {
                bed = await _context.Beds.FirstOrDefaultAsync(b => b.CurrentAdmissionId == admission.Id);
            }

            if (bed != null)
            {
                bed.Status = "available";
                bed.CurrentPatientId = null;
                bed.CurrentAdmissionId = null;
                bed.UpdatedAt = DateTime.UtcNow;
            }
        }
        else if (!string.IsNullOrWhiteSpace(updates.Status))
        {
            admission.Status = updates.Status;
        }

        // 3. Update other descriptive fields
        if (updates.DepartmentId != null) admission.DepartmentId = updates.DepartmentId;
        if (updates.Reason != null) admission.Reason = updates.Reason;
        if (updates.Notes != null) admission.Notes = updates.Notes;
        if (updates.DischargeSummary != null) admission.DischargeSummary = updates.DischargeSummary;

        if (updates.ExpectedDischargeDate.HasValue)
        {
            admission.ExpectedDischargeDate = DateTime.SpecifyKind(updates.ExpectedDischargeDate.Value, DateTimeKind.Utc);
        }

        if (updates.ActualDischargeDate.HasValue && updates.Status != "discharged")
        {
            admission.ActualDischargeDate = DateTime.SpecifyKind(updates.ActualDischargeDate.Value, DateTimeKind.Utc);
        }

        admission.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Audit Trail
        var patient = await _context.Patients.FindAsync(admission.PatientId);
        var patientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : admission.PatientId;
        var action = updates.Status == "discharged" ? "DISCHARGE_PATIENT" : "MODIFICATION_ADMISSION";
        await LogAuditAsync(
            _auditService,
            action,
            "Admission",
            admission.Id,
            patientName,
            $"{{\"status\":\"{admission.Status}\",\"bedId\":\"{admission.BedId}\"}}");

        return Ok(admission);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAdmission(string id)
    {
        var admission = await _context.Admissions.FirstOrDefaultAsync(a => a.Id == id);
        if (admission == null) return NotFound();

        // If deleting an active admission with an occupied bed, release bed
        if (admission.Status != "discharged" && !string.IsNullOrEmpty(admission.BedId))
        {
            var bed = await _context.Beds.FindAsync(admission.BedId);
            if (bed != null && bed.CurrentAdmissionId == admission.Id)
            {
                bed.Status = "available";
                bed.CurrentPatientId = null;
                bed.CurrentAdmissionId = null;
                bed.UpdatedAt = DateTime.UtcNow;
            }
        }

        admission.IsActive = false;
        admission.Status = "cancelled";
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
