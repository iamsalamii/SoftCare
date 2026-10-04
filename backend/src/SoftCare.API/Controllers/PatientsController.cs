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
public class PatientsController : BaseApiController
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public PatientsController(IApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    [HttpGet]
    public async Task<ActionResult> GetPatients([FromQuery] string? search = null)
    {
        var query = _context.Patients.Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(p =>
                p.FirstName.ToLower().Contains(term) ||
                p.LastName.ToLower().Contains(term) ||
                (p.Phone != null && p.Phone.Contains(term)) ||
                (p.SocialSecurityNumber != null && p.SocialSecurityNumber.Contains(term)));
        }

        var patients = await query
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(patients.Select(p => MapToDto(p)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetPatient(string id)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (patient == null) return NotFound(new { message = "Patient introuvable." });
        return Ok(MapToDto(patient));
    }

    [HttpPost]
    public async Task<ActionResult> CreatePatient([FromBody] JsonElement payload)
    {
        var patient = new Patient
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = payload.TryGetProperty("firstName", out var fn) ? fn.GetString() ?? "" : "",
            LastName = payload.TryGetProperty("lastName", out var ln) ? ln.GetString() ?? "" : "",
            DateOfBirth = payload.TryGetProperty("dateOfBirth", out var dob) && DateTime.TryParse(dob.GetString(), out var dt) ? DateTime.SpecifyKind(dt, DateTimeKind.Utc) : DateTime.UtcNow.AddYears(-30),
            Gender = payload.TryGetProperty("gender", out var g) ? g.GetString() ?? "other" : "other",
            Phone = payload.TryGetProperty("phone", out var ph) ? ph.GetString() ?? "" : "",
            Email = payload.TryGetProperty("email", out var em) ? em.GetString() : null,
            Address = payload.TryGetProperty("address", out var addr) ? addr.GetString() : null,
            City = payload.TryGetProperty("city", out var city) ? city.GetString() : null,
            BloodType = payload.TryGetProperty("bloodType", out var bt) ? bt.GetString() : null,
            SocialSecurityNumber = payload.TryGetProperty("socialSecurityNumber", out var ssn) ? ssn.GetString() : null,
            MaritalStatus = payload.TryGetProperty("maritalStatus", out var ms) ? ms.GetString() : null,
            Occupation = payload.TryGetProperty("occupation", out var occ) ? occ.GetString() : null,
            PrimaryDoctorId = payload.TryGetProperty("primaryDoctorId", out var doc) ? doc.GetString() : null,
            InsuranceId = payload.TryGetProperty("insuranceId", out var ins) ? ins.GetString() : null,
            Status = "active"
        };

        if (payload.TryGetProperty("emergencyContact", out var ec))
        {
            if (ec.TryGetProperty("name", out var ecName)) patient.EmergencyContactName = ecName.GetString();
            if (ec.TryGetProperty("phone", out var ecPhone)) patient.EmergencyContactPhone = ecPhone.GetString();
            if (ec.TryGetProperty("relationship", out var ecRel)) patient.EmergencyContactRelationship = ecRel.GetString();
        }

        if (payload.TryGetProperty("allergies", out var algs))
        {
            patient.AllergiesJson = algs.GetRawText();
        }

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        await LogAuditAsync(
            _auditService,
            "CREATION_PATIENT",
            "Patient",
            patient.Id,
            $"{patient.FirstName} {patient.LastName}",
            $"{{\"ssn\":\"{patient.SocialSecurityNumber}\",\"gender\":\"{patient.Gender}\"}}");

        return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, MapToDto(patient));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdatePatient(string id, [FromBody] JsonElement payload)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
        if (patient == null) return NotFound(new { message = "Patient introuvable." });

        if (payload.TryGetProperty("firstName", out var fn)) patient.FirstName = fn.GetString() ?? patient.FirstName;
        if (payload.TryGetProperty("lastName", out var ln)) patient.LastName = ln.GetString() ?? patient.LastName;
        if (payload.TryGetProperty("dateOfBirth", out var dob) && DateTime.TryParse(dob.GetString(), out var dt)) patient.DateOfBirth = DateTime.SpecifyKind(dt, DateTimeKind.Utc);
        if (payload.TryGetProperty("gender", out var g)) patient.Gender = g.GetString() ?? patient.Gender;
        if (payload.TryGetProperty("phone", out var ph)) patient.Phone = ph.GetString() ?? patient.Phone;
        if (payload.TryGetProperty("email", out var em)) patient.Email = em.GetString();
        if (payload.TryGetProperty("address", out var addr)) patient.Address = addr.GetString();
        if (payload.TryGetProperty("city", out var city)) patient.City = city.GetString();
        if (payload.TryGetProperty("bloodType", out var bt)) patient.BloodType = bt.GetString();
        if (payload.TryGetProperty("socialSecurityNumber", out var ssn)) patient.SocialSecurityNumber = ssn.GetString();
        if (payload.TryGetProperty("maritalStatus", out var ms)) patient.MaritalStatus = ms.GetString();
        if (payload.TryGetProperty("occupation", out var occ)) patient.Occupation = occ.GetString();
        if (payload.TryGetProperty("allergies", out var algs)) patient.AllergiesJson = algs.GetRawText();

        patient.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await LogAuditAsync(
            _auditService,
            "MODIFICATION_PATIENT",
            "Patient",
            patient.Id,
            $"{patient.FirstName} {patient.LastName}",
            $"{{\"phone\":\"{patient.Phone}\",\"city\":\"{patient.City}\"}}");

        return Ok(MapToDto(patient));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePatient(string id)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
        if (patient == null) return NotFound();

        patient.IsActive = false;
        patient.Status = "inactive";
        patient.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await LogAuditAsync(
            _auditService,
            "SUPPRESSION_PATIENT",
            "Patient",
            patient.Id,
            $"{patient.FirstName} {patient.LastName}");

        return NoContent();
    }

    private static object MapToDto(Patient p)
    {
        var allergies = new List<string>();
        try
        {
            if (!string.IsNullOrEmpty(p.AllergiesJson))
                allergies = JsonSerializer.Deserialize<List<string>>(p.AllergiesJson) ?? new List<string>();
        }
        catch { }

        return new
        {
            id = p.Id,
            firstName = p.FirstName,
            lastName = p.LastName,
            dateOfBirth = p.DateOfBirth.ToString("yyyy-MM-dd"),
            gender = p.Gender,
            phone = p.Phone,
            email = p.Email,
            address = p.Address,
            city = p.City,
            emergencyContact = new
            {
                name = p.EmergencyContactName ?? "",
                phone = p.EmergencyContactPhone ?? "",
                relationship = p.EmergencyContactRelationship ?? ""
            },
            bloodType = p.BloodType,
            socialSecurityNumber = p.SocialSecurityNumber,
            maritalStatus = p.MaritalStatus,
            occupation = p.Occupation,
            primaryDoctorId = p.PrimaryDoctorId,
            insuranceId = p.InsuranceId,
            allergies = allergies,
            status = p.Status,
            active = p.IsActive,
            createdAt = p.CreatedAt.ToString("yyyy-MM-dd")
        };
    }
}
