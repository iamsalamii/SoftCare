using System.Threading.Tasks;

namespace SoftCare.Application.Common.Interfaces;

public interface IAuditService
{
    Task LogAsync(
        string action,
        string resourceType,
        string resourceId,
        string patientName = "",
        string? detailsJson = null,
        string? userId = null,
        string? userName = null,
        string? userRole = null,
        string? ipAddress = null,
        string? userAgent = null);
}
