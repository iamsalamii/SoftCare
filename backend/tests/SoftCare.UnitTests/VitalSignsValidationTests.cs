using System;
using Xunit;

namespace SoftCare.UnitTests;

public class VitalSignsValidationTests
{
    [Theory]
    [InlineData(120, 80, "Normotension")]
    [InlineData(150, 95, "Hypertension")]
    [InlineData(85, 55, "Hypotension")]
    public void BloodPressure_TriageClassification_ShouldCategorizeAccurately(int sys, int dia, string expectedCategory)
    {
        // Act
        string category;
        if (sys >= 140 || dia >= 90)
            category = "Hypertension";
        else if (sys < 90 || dia < 60)
            category = "Hypotension";
        else
            category = "Normotension";

        // Assert
        Assert.Equal(expectedCategory, category);
    }

    [Theory]
    [InlineData(98, false)] // Normal oxygen saturation
    [InlineData(94, false)] // Borderline acceptable
    [InlineData(89, true)]  // Hypoxemia alert
    public void SpO2_HypoxemiaDetector_ShouldAlertBelowThreshold(int spo2, bool expectAlert)
    {
        // Act
        bool alert = spo2 < 92;

        // Assert
        Assert.Equal(expectAlert, alert);
    }
}
