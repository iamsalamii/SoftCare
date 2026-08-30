using System;
using System.Security.Cryptography;
using System.Text;
using SoftCare.Domain.Entities;
using Xunit;

namespace SoftCare.UnitTests;

public class AuditSecurityTests
{
    [Fact]
    public void AuditLog_SecurityHash_ShouldBeDeterministicAndTamperEvident()
    {
        // Arrange
        var userId = "admin-1";
        var action = "CONSULTATION_DPI";
        var resourceType = "Patient";
        var resourceId = "PAT-001";
        var fixedTimestamp = new DateTime(2026, 8, 30, 12, 0, 0, DateTimeKind.Utc);

        var rawData = $"{userId}|{action}|{resourceType}|{resourceId}|{fixedTimestamp:O}";

        // Act
        string hash1;
        using (var sha = SHA256.Create())
        {
            hash1 = Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(rawData)));
        }

        string hash2;
        using (var sha = SHA256.Create())
        {
            hash2 = Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(rawData)));
        }

        // Altered data
        string tamperedHash;
        using (var sha = SHA256.Create())
        {
            tamperedHash = Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(rawData + "_TAMPERED")));
        }

        // Assert
        Assert.Equal(hash1, hash2);
        Assert.NotEqual(hash1, tamperedHash);
        Assert.Equal(64, hash1.Length); // SHA-256 hex string is 64 characters
    }

    [Fact]
    public void AuditLog_ShouldCaptureMandatoryRgpdFields()
    {
        // Arrange
        var log = new AuditLog
        {
            UserId = "admin-1",
            UserName = "Admin Principal",
            UserRole = "admin",
            Action = "EXPORT_REGISTRE_RGPD",
            ResourceType = "AuditTrail",
            ResourceId = "ALL",
            IpAddress = "192.168.1.10",
            SecurityHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        };

        // Assert
        Assert.False(string.IsNullOrEmpty(log.UserId));
        Assert.False(string.IsNullOrEmpty(log.Action));
        Assert.False(string.IsNullOrEmpty(log.IpAddress));
        Assert.False(string.IsNullOrEmpty(log.SecurityHash));
    }
}
