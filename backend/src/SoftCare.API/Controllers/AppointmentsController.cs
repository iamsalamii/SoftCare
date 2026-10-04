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
public class AppointmentsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AppointmentsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetAppointments([FromQuery] string? date = null, [FromQuery] string? patientId = null)
    {
        var query = _context.Appointments.Where(a => a.IsActive);

        if (!string.IsNullOrEmpty(patientId))
        {
            query = query.Where(a => a.PatientId == patientId);
        }

        var list = await query.OrderByDescending(a => a.Date).ToListAsync();
        return Ok(list.Select(a => new
        {
            id = a.Id,
            patientId = a.PatientId,
            doctorId = a.DoctorId,
            date = a.Date.ToString("yyyy-MM-dd"),
            time = a.Time,
            duration = a.DurationMinutes,
            type = a.Type,
            status = a.Status,
            reason = a.Reason,
            notes = a.Notes,
            roomId = a.RoomId,
            createdAt = a.CreatedAt.ToString("yyyy-MM-dd")
        }));
    }

    [HttpPost]
    public async Task<ActionResult> CreateAppointment([FromBody] Appointment appointment)
    {
        appointment.Id = Guid.NewGuid().ToString();
        appointment.Date = DateTime.SpecifyKind(appointment.Date, DateTimeKind.Utc);
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        return Ok(appointment);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAppointment(string id, [FromBody] Appointment updates)
    {
        var appt = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id);
        if (appt == null) return NotFound();

        appt.Status = updates.Status ?? appt.Status;
        appt.Date = DateTime.SpecifyKind(updates.Date, DateTimeKind.Utc);
        appt.Time = updates.Time ?? appt.Time;
        appt.Notes = updates.Notes;
        appt.Reason = updates.Reason;
        appt.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(appt);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAppointment(string id)
    {
        var appt = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id);
        if (appt == null) return NotFound();

        appt.IsActive = false;
        appt.Status = "cancelled";
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
