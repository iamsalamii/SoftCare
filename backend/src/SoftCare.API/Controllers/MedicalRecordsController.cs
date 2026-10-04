using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

[Authorize]
public class MedicalRecordsController : BaseApiController
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public MedicalRecordsController(IApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    [HttpGet]
    public async Task<ActionResult> GetMedicalRecords([FromQuery] string? patientId = null)
    {
        var query = _context.MedicalRecords
            .Include(m => m.Prescriptions)
            .Where(m => m.IsActive);

        if (!string.IsNullOrEmpty(patientId))
        {
            query = query.Where(m => m.PatientId == patientId);
        }

        var records = await query.OrderByDescending(m => m.Date).ToListAsync();
        return Ok(records.Select(r => MapToDto(r)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetMedicalRecord(string id)
    {
        var record = await _context.MedicalRecords
            .Include(m => m.Prescriptions)
            .FirstOrDefaultAsync(m => m.Id == id && m.IsActive);

        if (record == null) return NotFound(new { message = "Dossier médical introuvable." });
        return Ok(MapToDto(record));
    }

    [HttpPost]
    public async Task<ActionResult> CreateMedicalRecord([FromBody] JsonElement payload)
    {
        var record = new MedicalRecord
        {
            Id = Guid.NewGuid().ToString(),
            PatientId = payload.TryGetProperty("patientId", out var pid) ? pid.GetString() ?? "" : "",
            DoctorId = payload.TryGetProperty("doctorId", out var did) ? did.GetString() ?? "" : "",
            Date = payload.TryGetProperty("date", out var dt) && DateTime.TryParse(dt.GetString(), out var dateVal) ? DateTime.SpecifyKind(dateVal, DateTimeKind.Utc) : DateTime.UtcNow,
            Type = payload.TryGetProperty("type", out var tp) ? tp.GetString() ?? "consultation" : "consultation",
            Title = payload.TryGetProperty("title", out var tt) ? tt.GetString() ?? "" : "",
            Description = payload.TryGetProperty("description", out var ds) ? ds.GetString() ?? "" : "",
            SymptomsJson = payload.TryGetProperty("symptoms", out var sym) ? sym.GetRawText() : "[]",
            Diagnosis = payload.TryGetProperty("diagnosis", out var diag) ? diag.GetString() ?? "" : "",
            Treatment = payload.TryGetProperty("treatment", out var trt) ? trt.GetString() ?? "" : "",
            FollowUp = payload.TryGetProperty("followUp", out var fu) ? fu.GetString() : null,
            Notes = payload.TryGetProperty("notes", out var nt) ? nt.GetString() : null,
            Status = "active"
        };

        if (payload.TryGetProperty("prescriptions", out var rxElement) && rxElement.ValueKind == JsonValueKind.Array)
        {
            foreach (var rx in rxElement.EnumerateArray())
            {
                record.Prescriptions.Add(new Prescription
                {
                    Id = Guid.NewGuid().ToString(),
                    MedicalRecordId = record.Id,
                    MedicationId = rx.TryGetProperty("medicationId", out var mid) ? mid.GetString() ?? "" : "",
                    MedicationName = rx.TryGetProperty("medicationName", out var mn) ? mn.GetString() ?? "" : "",
                    Dosage = rx.TryGetProperty("dosage", out var dsg) ? dsg.GetString() ?? "" : "",
                    Frequency = rx.TryGetProperty("frequency", out var frq) ? frq.GetString() ?? "" : "",
                    Duration = rx.TryGetProperty("duration", out var dur) ? dur.GetString() ?? "" : "",
                    Instructions = rx.TryGetProperty("instructions", out var ins) ? ins.GetString() ?? "" : "",
                    Status = "pending"
                });
            }
        }

        _context.MedicalRecords.Add(record);
        await _context.SaveChangesAsync();

        // Audit Trail
        var patient = !string.IsNullOrEmpty(record.PatientId) ? await _context.Patients.FindAsync(record.PatientId) : null;
        var patientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : (record.PatientId ?? "Patient");
        await LogAuditAsync(
            _auditService,
            "CREATION_DOSSIER_CLINIQUE",
            "MedicalRecord",
            record.Id,
            patientName,
            $"{{\"title\":\"{record.Title}\",\"diagnosis\":\"{record.Diagnosis}\",\"prescriptionsCount\":{record.Prescriptions.Count}}}");

        return CreatedAtAction(nameof(GetMedicalRecord), new { id = record.Id }, MapToDto(record));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateMedicalRecord(string id, [FromBody] JsonElement payload)
    {
        var record = await _context.MedicalRecords
            .Include(m => m.Prescriptions)
            .FirstOrDefaultAsync(m => m.Id == id && m.IsActive);

        if (record == null) return NotFound(new { message = "Dossier médical introuvable." });

        if (payload.TryGetProperty("type", out var tp)) record.Type = tp.GetString() ?? record.Type;
        if (payload.TryGetProperty("title", out var tt)) record.Title = tt.GetString() ?? record.Title;
        if (payload.TryGetProperty("description", out var ds)) record.Description = ds.GetString() ?? record.Description;
        if (payload.TryGetProperty("symptoms", out var sym)) record.SymptomsJson = sym.GetRawText();
        if (payload.TryGetProperty("diagnosis", out var diag)) record.Diagnosis = diag.GetString() ?? record.Diagnosis;
        if (payload.TryGetProperty("treatment", out var trt)) record.Treatment = trt.GetString() ?? record.Treatment;
        if (payload.TryGetProperty("followUp", out var fu)) record.FollowUp = fu.GetString();
        if (payload.TryGetProperty("notes", out var nt)) record.Notes = nt.GetString();
        if (payload.TryGetProperty("status", out var st)) record.Status = st.GetString() ?? record.Status;

        await _context.SaveChangesAsync();

        return Ok(MapToDto(record));
    }

    private static object MapToDto(MedicalRecord r)
    {
        object symptoms = new string[] { };
        try { symptoms = JsonSerializer.Deserialize<object>(r.SymptomsJson) ?? symptoms; } catch { }

        return new
        {
            id = r.Id,
            patientId = r.PatientId,
            doctorId = r.DoctorId,
            date = r.Date.ToString("yyyy-MM-dd"),
            type = r.Type,
            title = r.Title,
            description = r.Description,
            symptoms = symptoms,
            diagnosis = r.Diagnosis,
            treatment = r.Treatment,
            followUp = r.FollowUp,
            notes = r.Notes,
            status = r.Status,
            prescriptions = r.Prescriptions.Select(p => new
            {
                id = p.Id,
                medicationId = p.MedicationId,
                medicationName = p.MedicationName,
                dosage = p.Dosage,
                frequency = p.Frequency,
                duration = p.Duration,
                instructions = p.Instructions,
                status = p.Status
            }),
            attachments = new object[] { }
        };
    }
}
