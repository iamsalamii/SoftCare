using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SoftCare.Application.Common.Interfaces;

namespace SoftCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected async Task LogAuditAsync(
        IAuditService auditService,
        string action,
        string resourceType,
        string resourceId,
        string patientName = "",
        string? detailsJson = null)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value
                     ?? "system";
        var userName = User.FindFirst(ClaimTypes.Name)?.Value
                       ?? User.Identity?.Name
                       ?? "Praticien";
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value
                       ?? "staff";
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var userAgent = Request.Headers["User-Agent"].ToString();
        if (string.IsNullOrWhiteSpace(userAgent)) userAgent = "SoftCare WebApp/2.4";

        await auditService.LogAsync(
            action, resourceType, resourceId, patientName,
            detailsJson, userId, userName, userRole, ipAddress, userAgent);
    }
}
