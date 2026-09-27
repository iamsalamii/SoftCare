using System;
using SoftCare.Domain.Common;

namespace SoftCare.Domain.Entities;

public class PharmacySaleItem : BaseEntity
{
    public string PharmacySaleId { get; set; } = string.Empty;
    public PharmacySale? PharmacySale { get; set; }

    public string MedicationId { get; set; } = string.Empty;
    public Medication? Medication { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
}
