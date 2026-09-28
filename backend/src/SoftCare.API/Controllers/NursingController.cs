using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace SoftCare.API.Controllers;

[Authorize]
public class NursingController : BaseApiController
{
    private readonly IApplicationDbContext _context;

    public NursingController(IApplicationDbContext context)
    {
        _context = context;
    }

    // --- Vital Records ---

    [HttpGet("vitals")]
    public async Task<ActionResult<List<VitalRecord>>> GetVitalRecords()
    {
        return await _context.VitalRecords
            .Where(v => v.IsActive)
            .OrderByDescending(v => v.Timestamp)
            .ToListAsync();
    }

    [HttpGet("vitals/patient/{patientId}")]
    public async Task<ActionResult<List<VitalRecord>>> GetVitalRecordsByPatient(string patientId)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == patientId && p.IsActive);
        if (!patientExists) return NotFound("Patient not found");

        return await _context.VitalRecords
            .Where(v => v.PatientId == patientId && v.IsActive)
            .OrderByDescending(v => v.Timestamp)
            .ToListAsync();
    }

    [HttpPost("vitals")]
    public async Task<ActionResult<VitalRecord>> CreateVitalRecord(VitalRecord vitalRecord)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == vitalRecord.PatientId && p.IsActive);
        if (!patientExists) return BadRequest("Invalid PatientId");

        vitalRecord.Id = Guid.NewGuid().ToString();
        vitalRecord.CreatedAt = DateTime.UtcNow;
        vitalRecord.IsActive = true;

        _context.VitalRecords.Add(vitalRecord);
        await _context.SaveChangesAsync(default);

        return Ok(vitalRecord);
    }

    [HttpPut("vitals/{id}")]
    public async Task<ActionResult<VitalRecord>> UpdateVitalRecord(string id, VitalRecord vitalRecord)
    {
        if (id != vitalRecord.Id) return BadRequest();

        var existing = await _context.VitalRecords.FindAsync(id);
        if (existing == null || !existing.IsActive) return NotFound();

        existing.BloodPressureSys = vitalRecord.BloodPressureSys;
        existing.BloodPressureDia = vitalRecord.BloodPressureDia;
        existing.HeartRate = vitalRecord.HeartRate;
        existing.Temperature = vitalRecord.Temperature;
        existing.SpO2 = vitalRecord.SpO2;
        existing.RespiratoryRate = vitalRecord.RespiratoryRate;
        existing.PainScale = vitalRecord.PainScale;
        existing.BloodGlucose = vitalRecord.BloodGlucose;
        existing.Notes = vitalRecord.Notes;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(default);
        return Ok(existing);
    }

    [HttpDelete("vitals/{id}")]
    public async Task<ActionResult> DeleteVitalRecord(string id)
    {
        var existing = await _context.VitalRecords.FindAsync(id);
        if (existing == null || !existing.IsActive) return NotFound();

        existing.IsActive = false;
        existing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(default);

        return NoContent();
    }

    // --- Care Plans ---

    [HttpGet("care-plans")]
    public async Task<ActionResult<List<CarePlan>>> GetCarePlans()
    {
        return await _context.CarePlans
            .Where(c => c.IsActive)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("care-plans/patient/{patientId}")]
    public async Task<ActionResult<List<CarePlan>>> GetCarePlansByPatient(string patientId)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == patientId && p.IsActive);
        if (!patientExists) return NotFound("Patient not found");

        return await _context.CarePlans
            .Where(c => c.PatientId == patientId && c.IsActive)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    [HttpPost("care-plans")]
    public async Task<ActionResult<CarePlan>> CreateCarePlan(CarePlan carePlan)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == carePlan.PatientId && p.IsActive);
        if (!patientExists) return BadRequest("Invalid PatientId");

        carePlan.Id = Guid.NewGuid().ToString();
        carePlan.CreatedAt = DateTime.UtcNow;
        carePlan.IsActive = true;

        _context.CarePlans.Add(carePlan);
        await _context.SaveChangesAsync(default);

        return Ok(carePlan);
    }

    [HttpPut("care-plans/{id}")]
    public async Task<ActionResult<CarePlan>> UpdateCarePlan(string id, CarePlan carePlan)
    {
        if (id != carePlan.Id) return BadRequest();

        var existing = await _context.CarePlans.FindAsync(id);
        if (existing == null || !existing.IsActive) return NotFound();

        existing.Title = carePlan.Title;
        existing.Frequency = carePlan.Frequency;
        existing.Instructions = carePlan.Instructions;
        existing.Status = carePlan.Status;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(default);
        return Ok(existing);
    }

    [HttpDelete("care-plans/{id}")]
    public async Task<ActionResult> DeleteCarePlan(string id)
    {
        var existing = await _context.CarePlans.FindAsync(id);
        if (existing == null || !existing.IsActive) return NotFound();

        existing.IsActive = false;
        existing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(default);

        return NoContent();
    }

    // --- Nursing Notes ---

    [HttpGet("notes")]
    public async Task<ActionResult<List<NursingNote>>> GetNursingNotes()
    {
        return await _context.NursingNotes
            .Where(n => n.IsActive)
            .OrderByDescending(n => n.Timestamp)
            .ToListAsync();
    }

    [HttpGet("notes/patient/{patientId}")]
    public async Task<ActionResult<List<NursingNote>>> GetNursingNotesByPatient(string patientId)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == patientId && p.IsActive);
        if (!patientExists) return NotFound("Patient not found");

        return await _context.NursingNotes
            .Where(n => n.PatientId == patientId && n.IsActive)
            .OrderByDescending(n => n.Timestamp)
            .ToListAsync();
    }

    [HttpPost("notes")]
    public async Task<ActionResult<NursingNote>> CreateNursingNote(NursingNote note)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == note.PatientId && p.IsActive);
        if (!patientExists) return BadRequest("Invalid PatientId");

        note.Id = Guid.NewGuid().ToString();
        note.CreatedAt = DateTime.UtcNow;
        note.IsActive = true;

        _context.NursingNotes.Add(note);
        await _context.SaveChangesAsync(default);

        return Ok(note);
    }

    [HttpPut("notes/{id}")]
    public async Task<ActionResult<NursingNote>> UpdateNursingNote(string id, NursingNote note)
    {
        if (id != note.Id) return BadRequest();

        var existing = await _context.NursingNotes.FindAsync(id);
        if (existing == null || !existing.IsActive) return NotFound();

        existing.Category = note.Category;
        existing.Content = note.Content;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(default);
        return Ok(existing);
    }

    [HttpDelete("notes/{id}")]
    public async Task<ActionResult> DeleteNursingNote(string id)
    {
        var existing = await _context.NursingNotes.FindAsync(id);
        if (existing == null || !existing.IsActive) return NotFound();

        existing.IsActive = false;
        existing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(default);

        return NoContent();
    }
}
