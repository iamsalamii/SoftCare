using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;
using System.Text.Json;

namespace SoftCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public DepartmentsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetDepartments()
    {
        var departments = await _context.Departments.Where(d => d.IsActive).OrderBy(d => d.Name).ToListAsync();
        return Ok(departments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetDepartment(string id)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
        if (department == null) return NotFound();
        return Ok(department);
    }

    [HttpPost]
    public async Task<ActionResult> CreateDepartment([FromBody] JsonElement payload)
    {
        var department = new Department
        {
            Id = Guid.NewGuid().ToString(),
            Name = payload.TryGetProperty("name", out var nm) ? nm.GetString() ?? "" : "",
            Code = payload.TryGetProperty("code", out var cd) ? cd.GetString() ?? "" : "",
            Type = payload.TryGetProperty("type", out var tp) ? tp.GetString() ?? "general" : "general",
            HeadId = payload.TryGetProperty("headId", out var hd) ? hd.GetString() : null,
            Beds = payload.TryGetProperty("beds", out var bd) && bd.TryGetInt32(out var b) ? b : 0,
            Location = payload.TryGetProperty("location", out var loc) ? loc.GetString() : null,
            Phone = payload.TryGetProperty("phone", out var ph) ? ph.GetString() : null,
            Description = payload.TryGetProperty("description", out var desc) ? desc.GetString() : null,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, department);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateDepartment(string id, [FromBody] JsonElement payload)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Id == id);
        if (department == null) return NotFound();

        if (payload.TryGetProperty("name", out var nm)) department.Name = nm.GetString() ?? department.Name;
        if (payload.TryGetProperty("code", out var cd)) department.Code = cd.GetString() ?? department.Code;
        if (payload.TryGetProperty("type", out var tp)) department.Type = tp.GetString() ?? department.Type;
        if (payload.TryGetProperty("headId", out var hd)) department.HeadId = hd.GetString();
        if (payload.TryGetProperty("beds", out var bd) && bd.TryGetInt32(out var b)) department.Beds = b;
        if (payload.TryGetProperty("location", out var loc)) department.Location = loc.GetString();
        if (payload.TryGetProperty("phone", out var ph)) department.Phone = ph.GetString();
        if (payload.TryGetProperty("description", out var desc)) department.Description = desc.GetString();

        department.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(department);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteDepartment(string id)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Id == id);
        if (department == null) return NotFound();

        department.IsActive = false;
        department.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
