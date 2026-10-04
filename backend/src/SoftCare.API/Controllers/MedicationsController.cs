using System;
using System.Linq;
using System.Text.Json;
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
public class MedicationsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public MedicationsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetMedications([FromQuery] string? search = null, [FromQuery] bool? isBiotech = null)
    {
        var query = _context.Medications.Where(m => m.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(m =>
                m.Name.ToLower().Contains(term) ||
                (m.GenericName != null && m.GenericName.ToLower().Contains(term)) ||
                (m.Barcode != null && m.Barcode.Contains(term)) ||
                (m.BatchNumber != null && m.BatchNumber.ToLower().Contains(term)));
        }

        if (isBiotech.HasValue)
        {
            query = query.Where(m => m.IsBiotech == isBiotech.Value);
        }

        var medications = await query.OrderBy(m => m.Name).ToListAsync();
        return Ok(medications.Select(m => MapToDto(m)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetMedication(string id)
    {
        var med = await _context.Medications.FirstOrDefaultAsync(m => m.Id == id && m.IsActive);
        if (med == null) return NotFound(new { message = "Médicament introuvable." });
        return Ok(MapToDto(med));
    }

    [HttpGet("scan/{barcode}")]
    public async Task<ActionResult> ScanBarcode(string barcode)
    {
        var cleanBarcode = barcode.Trim().ToUpper();
        var med = await _context.Medications
            .FirstOrDefaultAsync(m => m.IsActive && 
                ((m.Barcode != null && m.Barcode.ToUpper() == cleanBarcode) ||
                 (m.BatchNumber != null && m.BatchNumber.ToUpper() == cleanBarcode)));

        if (med == null)
        {
            return NotFound(new { message = $"Aucun médicament trouvé pour le code {barcode}." });
        }

        return Ok(MapToDto(med));
    }

    [HttpPost]
    public async Task<ActionResult> CreateMedication([FromBody] JsonElement payload)
    {
        var med = new Medication
        {
            Id = Guid.NewGuid().ToString(),
            Name = payload.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "",
            GenericName = payload.TryGetProperty("genericName", out var gn) ? gn.GetString() : null,
            Category = payload.TryGetProperty("category", out var cat) ? cat.GetString() ?? "Général" : "Général",
            Manufacturer = payload.TryGetProperty("manufacturer", out var man) ? man.GetString() : null,
            Stock = payload.TryGetProperty("stock", out var st) ? st.GetInt32() : 0,
            MinStock = payload.TryGetProperty("minStock", out var mst) ? mst.GetInt32() : 10,
            Price = payload.TryGetProperty("price", out var pr) ? pr.GetDecimal() : (payload.TryGetProperty("unitPrice", out var up) ? up.GetDecimal() : 0),
            ExpiryDate = payload.TryGetProperty("expiryDate", out var exp) && DateTime.TryParse(exp.GetString(), out var expDt) ? DateTime.SpecifyKind(expDt, DateTimeKind.Utc) : null,
            BatchNumber = payload.TryGetProperty("batchNumber", out var bn) ? bn.GetString() : $"LT-{DateTime.UtcNow.Year}-{new Random().Next(100, 999)}",
            Barcode = payload.TryGetProperty("barcode", out var bc) ? bc.GetString() : null,
            QrCode = payload.TryGetProperty("qrCode", out var qr) ? qr.GetString() : null,
            Description = payload.TryGetProperty("description", out var desc) ? desc.GetString() : null,
            DosageForm = payload.TryGetProperty("dosageForm", out var df) ? df.GetString() ?? "tablet" : "tablet",
            Strength = payload.TryGetProperty("strength", out var str) ? str.GetString() : null,
            RequiresPrescription = payload.TryGetProperty("requiresPrescription", out var rp) && rp.GetBoolean(),
            Location = payload.TryGetProperty("location", out var loc) ? loc.GetString() : null,
            Supplier = payload.TryGetProperty("supplier", out var sup) ? sup.GetString() : null,
            StorageCondition = payload.TryGetProperty("storageCondition", out var sc) ? sc.GetString() ?? "ambient" : "ambient",
            IsBiotech = payload.TryGetProperty("isBiotech", out var ib) && ib.GetBoolean(),
            AtcCode = payload.TryGetProperty("atcCode", out var atc) ? atc.GetString() : null,
            Status = "active"
        };

        if (string.IsNullOrEmpty(med.Barcode))
        {
            med.Barcode = $"34009{new Random().Next(10000000, 99999999)}";
        }

        _context.Medications.Add(med);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMedication), new { id = med.Id }, MapToDto(med));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateMedication(string id, [FromBody] JsonElement payload)
    {
        var med = await _context.Medications.FirstOrDefaultAsync(m => m.Id == id);
        if (med == null) return NotFound(new { message = "Médicament introuvable." });

        if (payload.TryGetProperty("name", out var n)) med.Name = n.GetString() ?? med.Name;
        if (payload.TryGetProperty("genericName", out var gn)) med.GenericName = gn.GetString();
        if (payload.TryGetProperty("category", out var cat)) med.Category = cat.GetString() ?? med.Category;
        if (payload.TryGetProperty("manufacturer", out var man)) med.Manufacturer = man.GetString();
        if (payload.TryGetProperty("stock", out var st)) med.Stock = st.GetInt32();
        if (payload.TryGetProperty("minStock", out var mst)) med.MinStock = mst.GetInt32();
        if (payload.TryGetProperty("price", out var pr)) med.Price = pr.GetDecimal();
        if (payload.TryGetProperty("unitPrice", out var up)) med.Price = up.GetDecimal();
        if (payload.TryGetProperty("expiryDate", out var exp) && DateTime.TryParse(exp.GetString(), out var expDt)) med.ExpiryDate = DateTime.SpecifyKind(expDt, DateTimeKind.Utc);
        if (payload.TryGetProperty("batchNumber", out var bn)) med.BatchNumber = bn.GetString();
        if (payload.TryGetProperty("barcode", out var bc)) med.Barcode = bc.GetString();
        if (payload.TryGetProperty("dosageForm", out var df)) med.DosageForm = df.GetString() ?? med.DosageForm;
        if (payload.TryGetProperty("strength", out var str)) med.Strength = str.GetString();
        if (payload.TryGetProperty("location", out var loc)) med.Location = loc.GetString();
        if (payload.TryGetProperty("storageCondition", out var sc)) med.StorageCondition = sc.GetString() ?? med.StorageCondition;
        if (payload.TryGetProperty("isBiotech", out var ib)) med.IsBiotech = ib.GetBoolean();

        med.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(MapToDto(med));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMedication(string id)
    {
        var med = await _context.Medications.FirstOrDefaultAsync(m => m.Id == id);
        if (med == null) return NotFound();

        med.IsActive = false;
        med.Status = "discontinued";
        med.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("movements")]
    public async Task<ActionResult> GetMovements()
    {
        var movements = await _context.MedicationMovements
            .OrderByDescending(m => m.Date)
            .Take(100)
            .ToListAsync();
        return Ok(movements);
    }

    [HttpPost("movements")]
    public async Task<ActionResult> AddMovement([FromBody] MedicationMovement movement)
    {
        movement.Id = Guid.NewGuid().ToString();
        movement.Date = DateTime.UtcNow;
        _context.MedicationMovements.Add(movement);

        var med = await _context.Medications.FirstOrDefaultAsync(m => m.Id == movement.MedicationId);
        if (med != null)
        {
            if (movement.Type == "in") med.Stock += movement.Quantity;
            else if (movement.Type == "out") med.Stock = Math.Max(0, med.Stock - movement.Quantity);
            else if (movement.Type == "adjustment") med.Stock = movement.Quantity;
        }

        await _context.SaveChangesAsync();
        return Ok(movement);
    }

    private static object MapToDto(Medication m)
    {
        return new
        {
            id = m.Id,
            name = m.Name,
            genericName = m.GenericName ?? "",
            category = m.Category,
            manufacturer = m.Manufacturer,
            stock = m.Stock,
            minStock = m.MinStock,
            price = m.Price,
            unitPrice = m.Price,
            expiryDate = m.ExpiryDate?.ToString("yyyy-MM-dd"),
            batchNumber = m.BatchNumber,
            barcode = m.Barcode,
            qrCode = m.QrCode,
            description = m.Description,
            dosageForm = m.DosageForm,
            strength = m.Strength,
            requiresPrescription = m.RequiresPrescription,
            location = m.Location,
            supplier = m.Supplier,
            storageCondition = m.StorageCondition,
            isBiotech = m.IsBiotech,
            atcCode = m.AtcCode,
            status = m.Status,
            createdAt = m.CreatedAt.ToString("yyyy-MM-dd")
        };
    }
}
