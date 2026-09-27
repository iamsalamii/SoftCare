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
[ApiController]
[Route("api/[controller]")]
public class PharmacySalesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public PharmacySalesController(IApplicationDbContext context)
    {
        _context = context;
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
        
        foreach(var item in sale.Items)
        {
            item.Id = Guid.NewGuid().ToString();
            item.PharmacySaleId = sale.Id;
            
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
                    Reason = "Vente pharmacie " + sale.ReceiptNumber,
                    PerformedBy = sale.UserId
                });
            }
        }

        _context.PharmacySales.Add(sale);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, sale);
    }
}
