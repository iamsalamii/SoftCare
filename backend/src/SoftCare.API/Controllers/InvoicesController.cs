using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

[Authorize]
public class InvoicesController : BaseApiController
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public InvoicesController(IApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    [HttpGet]
    public async Task<ActionResult> GetInvoices()
    {
        var invoices = await _context.Invoices
            .Include(i => i.Items)
            .Where(i => i.IsActive)
            .OrderByDescending(i => i.Date)
            .ToListAsync();

        return Ok(invoices.Select(i => new
        {
            id = i.Id,
            invoiceNumber = i.InvoiceNumber,
            patientId = i.PatientId,
            date = i.Date.ToString("yyyy-MM-dd"),
            dueDate = i.DueDate?.ToString("yyyy-MM-dd"),
            subtotal = i.Subtotal,
            taxRate = i.TaxRate,
            taxAmount = i.TaxAmount,
            discountAmount = i.DiscountAmount,
            total = i.Total,
            status = i.Status,
            notes = i.Notes,
            payments = i.Status == "paid" 
                ? new object[] { new { id = $"pay-{i.Id}", invoiceId = i.Id, amount = i.Total, method = "cash", date = i.Date.ToString("yyyy-MM-dd"), receivedBy = "Système" } }
                : Array.Empty<object>(),
            items = i.Items.Select(item => new
            {
                id = item.Id,
                description = item.Description,
                type = item.Type,
                quantity = item.Quantity,
                unitPrice = item.UnitPrice,
                total = item.Total
            })
        }));
    }

    [HttpPost]
    public async Task<ActionResult> CreateInvoice([FromBody] Invoice invoice)
    {
        invoice.Id = Guid.NewGuid().ToString();
        invoice.InvoiceNumber = string.IsNullOrEmpty(invoice.InvoiceNumber) ? $"FAC-{DateTime.UtcNow.Year}-{new Random().Next(1000, 9999)}" : invoice.InvoiceNumber;
        invoice.Date = DateTime.SpecifyKind(invoice.Date, DateTimeKind.Utc);
        if (invoice.DueDate.HasValue)
        {
            invoice.DueDate = DateTime.SpecifyKind(invoice.DueDate.Value, DateTimeKind.Utc);
        }
        invoice.CreatedAt = DateTime.UtcNow;

        if (invoice.Items != null)
        {
            foreach (var item in invoice.Items)
            {
                item.Id = Guid.NewGuid().ToString();
                item.InvoiceId = invoice.Id;
                item.CreatedAt = DateTime.UtcNow;
            }
        }

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        // Audit Trail
        var patient = !string.IsNullOrEmpty(invoice.PatientId) ? await _context.Patients.FindAsync(invoice.PatientId) : null;
        var patientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : (invoice.PatientId ?? "Patient");
        await LogAuditAsync(
            _auditService,
            "CREATION_FACTURE",
            "Invoice",
            invoice.Id,
            patientName,
            $"{{\"invoiceNumber\":\"{invoice.InvoiceNumber}\",\"total\":{invoice.Total},\"status\":\"{invoice.Status}\"}}");

        return Ok(invoice);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInvoice(string id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null || !invoice.IsActive)
            return NotFound();

        invoice.IsActive = false;
        invoice.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
