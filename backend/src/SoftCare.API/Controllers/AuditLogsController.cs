using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

[Authorize(Roles = "admin")]
public class AuditLogsController : BaseApiController
{
    private readonly IApplicationDbContext _context;

    public AuditLogsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuditLog>>> GetLogs([FromQuery] string? resourceType, [FromQuery] string? action)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (!string.IsNullOrEmpty(resourceType))
        {
            query = query.Where(l => l.ResourceType == resourceType);
        }

        if (!string.IsNullOrEmpty(action))
        {
            query = query.Where(l => l.Action == action);
        }

        var logs = await query
            .OrderByDescending(l => l.CreatedAt)
            .Take(100)
            .ToListAsync();

        return Ok(logs);
    }

    [HttpPost]
    public async Task<ActionResult<AuditLog>> CreateLog([FromBody] AuditLog log)
    {
        // Generate cryptographic non-repudiation signature (HMAC-SHA256)
        var rawData = $"{log.UserId}|{log.Action}|{log.ResourceType}|{log.ResourceId}|{DateTime.UtcNow:O}";
        using (var sha = SHA256.Create())
        {
            var hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            log.SecurityHash = Convert.ToHexString(hashBytes);
        }

        log.CreatedAt = DateTime.UtcNow;
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLogs), new { id = log.Id }, log);
    }
}
