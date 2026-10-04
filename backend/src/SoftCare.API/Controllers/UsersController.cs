using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;
using System.Text.Json;

namespace SoftCare.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public UsersController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetUsers()
    {
        var users = await _context.Users.Where(u => u.IsActive).OrderBy(u => u.Name).ToListAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetUser(string id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult> CreateUser([FromBody] JsonElement payload)
    {
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = payload.TryGetProperty("name", out var nm) ? nm.GetString() ?? "" : "",
            Email = payload.TryGetProperty("email", out var em) ? em.GetString() ?? "" : "",
            Role = payload.TryGetProperty("role", out var rl) ? rl.GetString() ?? "staff" : "staff",
            DepartmentId = payload.TryGetProperty("departmentId", out var dep) ? dep.GetString() : null,
            Specialization = payload.TryGetProperty("specialization", out var spec) ? spec.GetString() : null,
            Phone = payload.TryGetProperty("phone", out var ph) ? ph.GetString() : null,
            LicenseNumber = payload.TryGetProperty("licenseNumber", out var lic) ? lic.GetString() : null,
            Avatar = payload.TryGetProperty("avatar", out var av) ? av.GetString() : null,
            Status = payload.TryGetProperty("status", out var st) ? st.GetString() ?? "active" : "active",
            PasswordHash = "default_hash", // Hardcoded for simplicity since no real auth exists yet
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(string id, [FromBody] JsonElement payload)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();

        if (payload.TryGetProperty("name", out var nm)) user.Name = nm.GetString() ?? user.Name;
        if (payload.TryGetProperty("email", out var em)) user.Email = em.GetString() ?? user.Email;
        if (payload.TryGetProperty("role", out var rl)) user.Role = rl.GetString() ?? user.Role;
        if (payload.TryGetProperty("departmentId", out var dep)) user.DepartmentId = dep.GetString();
        if (payload.TryGetProperty("specialization", out var spec)) user.Specialization = spec.GetString();
        if (payload.TryGetProperty("phone", out var ph)) user.Phone = ph.GetString();
        if (payload.TryGetProperty("licenseNumber", out var lic)) user.LicenseNumber = lic.GetString();
        if (payload.TryGetProperty("avatar", out var av)) user.Avatar = av.GetString();
        if (payload.TryGetProperty("status", out var st)) user.Status = st.GetString() ?? user.Status;

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(string id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();

        user.IsActive = false;
        user.Status = "inactive";
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
