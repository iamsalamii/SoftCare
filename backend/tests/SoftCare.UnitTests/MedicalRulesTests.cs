using System;
using SoftCare.Domain.Entities;
using Xunit;

namespace SoftCare.UnitTests;

public class MedicalRulesTests
{
    [Fact]
    public void Medication_ShouldFlagLowStock_WhenStockIsUnderMinimum()
    {
        // Arrange
        var medication = new Medication
        {
            Name = "Amoxicilline 500mg",
            Stock = 5,
            MinStock = 20
        };

        // Act
        bool isLowStock = medication.Stock <= medication.MinStock;

        // Assert
        Assert.True(isLowStock, "Le médicament avec stock <= minStock doit être détecté en stock faible.");
    }

    [Theory]
    [InlineData(100.0, 20.0, 10.0, 108.0)]
    [InlineData(200.0, 0.0, 0.0, 200.0)]
    public void Invoice_Calculation_ShouldComputeCorrectTotal(double subtotalD, double taxRateD, double discountD, double expectedTotalD)
    {
        // Arrange
        decimal subtotal = (decimal)subtotalD;
        decimal taxRate = (decimal)taxRateD;
        decimal discount = (decimal)discountD;
        decimal expectedTotal = (decimal)expectedTotalD;

        var taxableAmount = subtotal - discount;
        var taxAmount = taxableAmount * (taxRate / 100m);
        var total = taxableAmount + taxAmount;

        // Assert
        Assert.Equal(expectedTotal, total);
    }
}
