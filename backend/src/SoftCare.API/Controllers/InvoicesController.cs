using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public InvoicesController(IApplicationDbContext context)
    {
        _context = context;
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
        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();
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
