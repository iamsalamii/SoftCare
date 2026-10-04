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
public class PharmacySalesController : BaseApiController
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public PharmacySalesController(IApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }



    [HttpGet]
    public async Task<ActionResult<IEnumerable<PharmacySale>>> GetSales()
    {
        return await _context.PharmacySales
            .Include(s => s.Items)
            .ThenInclude(i => i.Medication)
            .Include(s => s.Patient)
            .Include(s => s.User)
            .OrderByDescending(s => s.SaleDate)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PharmacySale>> GetSale(string id)
    {
        var sale = await _context.PharmacySales
            .Include(s => s.Items)
            .ThenInclude(i => i.Medication)
            .Include(s => s.Patient)
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null)
            return NotFound();

        return sale;
    }

    [HttpPost]
    public async Task<ActionResult<PharmacySale>> CreateSale(PharmacySale sale)
    {
        sale.Id = Guid.NewGuid().ToString();
        sale.SaleDate = DateTime.UtcNow;
        sale.ReceiptNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";
        
        if (string.IsNullOrEmpty(sale.UserId))
        {
            sale.UserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("sub")?.Value 
                          ?? "";
        }
        
        foreach(var item in sale.Items)
        {
            item.Id = Guid.NewGuid().ToString();
            item.PharmacySaleId = sale.Id;
            item.CreatedAt = DateTime.UtcNow;
            
            // Stock deduction
            var medication = await _context.Medications.FindAsync(item.MedicationId);
            if(medication != null)
            {
                medication.Stock -= item.Quantity;
                _context.MedicationMovements.Add(new MedicationMovement 
                {
                    Id = Guid.NewGuid().ToString(),
                    MedicationId = medication.Id,
                    Type = "out",
                    Quantity = item.Quantity,
                    Date = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    Reason = "Vente pharmacie " + sale.ReceiptNumber,
                    PerformedBy = sale.UserId
                });
            }
        }

        sale.CreatedAt = DateTime.UtcNow;
        _context.PharmacySales.Add(sale);
        await _context.SaveChangesAsync();

        // Audit Trail
        var patient = !string.IsNullOrEmpty(sale.PatientId) ? await _context.Patients.FindAsync(sale.PatientId) : null;
        var patientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : (sale.PatientId ?? "Vente Comptoir");
        await LogAuditAsync(
            _auditService,
            "DELIVRANCE_POS",
            "PharmacySale",
            sale.Id,
            patientName,
            $"{{\"receiptNumber\":\"{sale.ReceiptNumber}\",\"totalAmount\":{sale.TotalAmount},\"itemsCount\":{sale.Items.Count}}}");

        return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, sale);
    }
}
