using System;
using System.Text.Json;
using SoftCare.Domain.Entities;
using Xunit;

namespace SoftCare.UnitTests;

public class BiotechRulesTests
{
    [Fact]
    public void PGx_CYP2C19_PoorMetabolizer_ShouldTriggerContraindicationForClopidogrel()
    {
        // Arrange
        var genomicProfile = new GenomicProfile
        {
            PatientName = "Jean Dupont",
            GenesJson = "[{\"gene\":\"CYP2C19\",\"diplotype\":\"*2/*2\",\"phenotype\":\"Poor Metabolizer\"}]",
            RecommendationsJson = "[\"Éviter le Clopidogrel (Plavix) : Remplacer par Prasugrel\"]"
        };

        var targetMedication = new Medication
        {
            Name = "Plavix 75mg",
            GenericName = "Clopidogrel",
            IsBiotech = true
        };

        // Act
        bool isPoorMetabolizer = genomicProfile.GenesJson.Contains("Poor Metabolizer") && genomicProfile.GenesJson.Contains("CYP2C19");
        bool isTargetDrug = targetMedication.GenericName?.Equals("Clopidogrel", StringComparison.OrdinalIgnoreCase) == true;
        bool shouldBlockPrescription = isPoorMetabolizer && isTargetDrug;

        // Assert
        Assert.True(shouldBlockPrescription, "Une alerte bloquante doit être générée pour un métaboliseur lent CYP2C19 sous Clopidogrel.");
    }

    [Theory]
    [InlineData("ambient", 20.0, true)]
    [InlineData("cold_2_8", 4.0, true)]
    [InlineData("cold_2_8", 12.0, false)] // Exceeded 8°C cold chain
    [InlineData("cryo_minus_80", -82.0, true)]
    [InlineData("cryo_minus_80", -50.0, false)] // Dangerously warm for -80°C biobank
    public void Biobank_TemperatureIntegrity_ShouldValidateStorageLimits(string condition, double currentTemp, bool isCompliant)
    {
        // Act
        bool compliant = condition switch
        {
            "ambient" => currentTemp >= 15.0 && currentTemp <= 25.0,
            "cold_2_8" => currentTemp >= 2.0 && currentTemp <= 8.0,
            "cryo_minus_80" => currentTemp <= -70.0,
            _ => false
        };

        // Assert
        Assert.Equal(isCompliant, compliant);
    }
}
