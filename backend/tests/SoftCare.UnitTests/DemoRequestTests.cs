using System;
using System.Text.Json;
using SoftCare.Domain.Entities;
using Xunit;

namespace SoftCare.UnitTests;

public class DemoRequestTests
{
    [Fact]
    public void DemoLead_ShouldInitializeWithPendingStatusAndAuditTrail()
    {
        // Arrange
        var lead = new DemoLead
        {
            Id = Guid.NewGuid().ToString(),
            ReferenceCode = "DEMO-123456",
            FullName = "Pr. Jean Dupont",
            Email = "jean.dupont@chu-paris.fr",
            Phone = "+33 6 12 34 56 78",
            Facility = "CHU Paris Nord",
            PreferredDate = "2026-10-15 [10:00 - 11:00]",
            ModulesJson = JsonSerializer.Serialize(new[] { "DPI", "Biotech" }),
            Notes = "Chef de pôle cardiologie",
            IpAddress = "192.168.1.100",
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        Assert.Equal("pending", lead.Status);
        Assert.StartsWith("DEMO-", lead.ReferenceCode);
        Assert.Contains("chu-paris.fr", lead.Email);
        Assert.True(lead.IsActive);
        Assert.NotNull(lead.ModulesJson);
    }

    [Theory]
    [InlineData("bot-val", null, true)]
    [InlineData(null, "http://spam.org", true)]
    [InlineData("", "", false)]
    [InlineData(null, null, false)]
    public void Honeypot_Detection_ShouldFlagAutomatedSpam(string? honeypot, string? website, bool isSpam)
    {
        var detected = !string.IsNullOrWhiteSpace(honeypot) || !string.IsNullOrWhiteSpace(website);
        Assert.Equal(isSpam, detected);
    }
}
