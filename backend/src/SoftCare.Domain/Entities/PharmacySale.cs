using System;
using System.Collections.Generic;
using SoftCare.Domain.Common;

namespace SoftCare.Domain.Entities;

public class PharmacySale : BaseEntity
{
    public string ReceiptNumber { get; set; } = string.Empty;
    public DateTime SaleDate { get; set; }
    public string? PatientId { get; set; }
    public Patient? Patient { get; set; }
    public string? CustomerName { get; set; }
    
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = "completed"; // completed, refunded, cancelled
    
    public string UserId { get; set; } = string.Empty;
    public User? User { get; set; }

    public ICollection<PharmacySaleItem> Items { get; private set; } = new List<PharmacySaleItem>();
}
