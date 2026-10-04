using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.Infrastructure.Services;

public class AuditService : IAuditService
{
    private readonly IApplicationDbContext _context;

    public AuditService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task LogAsync(
        string action,
        string resourceType,
        string resourceId,
        string patientName = "",
        string? detailsJson = null,
        string? userId = null,
        string? userName = null,
        string? userRole = null,
        string? ipAddress = null,
        string? userAgent = null)
    {
        var timestamp = DateTime.UtcNow;
        var effectiveUserId = string.IsNullOrWhiteSpace(userId) ? "system" : userId;
        var rawData = $"{effectiveUserId}|{action}|{resourceType}|{resourceId}|{timestamp:O}";

        string securityHash;
        using (var sha = SHA256.Create())
        {
            var hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            securityHash = Convert.ToHexString(hashBytes);
        }

        var log = new AuditLog
        {
            Id = Guid.NewGuid().ToString(),
            UserId = effectiveUserId,
            UserName = string.IsNullOrWhiteSpace(userName) ? "Système" : userName,
            UserRole = string.IsNullOrWhiteSpace(userRole) ? "admin" : userRole,
            Action = action,
            ResourceType = resourceType,
            ResourceId = resourceId,
            PatientName = string.IsNullOrWhiteSpace(patientName) ? "Global" : patientName,
            IpAddress = string.IsNullOrWhiteSpace(ipAddress) ? "127.0.0.1" : ipAddress,
            UserAgent = string.IsNullOrWhiteSpace(userAgent) ? "SoftCare WebApp/2.4" : userAgent,
            SecurityHash = securityHash,
            DetailsJson = detailsJson ?? "{}",
            CreatedAt = timestamp,
            UpdatedAt = timestamp,
            IsActive = true
        };

        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
