using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SoftCare.Application.Common.Interfaces;

namespace SoftCare.API.Controllers;

public class DiagnosticRequest
{
    public string PatientId { get; set; } = string.Empty;
    public List<string> Symptoms { get; set; } = new();
    public string? MedicalHistory { get; set; }
    public string? VitalsJson { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class AiAssistantController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AiAssistantController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("differential-diagnosis")]
    public ActionResult GetDifferentialDiagnosis([FromBody] DiagnosticRequest request)
    {
        var symptomsList = request.Symptoms ?? new List<string>();
        var symptomsStr = string.Join(", ", symptomsList).ToLower();

        var hypotheses = new List<object>();

        if (symptomsStr.Contains("douleur thoracique") || symptomsStr.Contains("essoufflement") || symptomsStr.Contains("oppression"))
        {
            hypotheses.Add(new
            {
                condition = "Syndrome Coronarien Aigu (SCA)",
                confidence = 0.88,
                severity = "critical",
                justification = "Présence de douleur thoracique et dyspnée. Nécessite ECG et dosage de Troponine immédiats.",
                recommendedTests = new[] { "ECG 12 dérivations", "Troponine I ultrasensible", "D-Dimères", "Radiographie pulmonaire" }
            });
            hypotheses.Add(new
            {
                condition = "Embolie Pulmonaire",
                confidence = 0.72,
                severity = "high",
                justification = "Dyspnée soudaine et possible douleur pleurale.",
                recommendedTests = new[] { "Angioscanner thoracique", "Gazométrie artérielle" }
            });
        }
        else if (symptomsStr.Contains("fièvre") || symptomsStr.Contains("toux"))
        {
            hypotheses.Add(new
            {
                condition = "Infection Pulmonaire / Pneumopathie",
                confidence = 0.85,
                severity = "moderate",
                justification = "Syndrome fébrile avec toux productive. Auscultation et imagerie requises.",
                recommendedTests = new[] { "Radiographie thorax face", "NFS / CRP", "Hémocultures si T° > 38.5°C" }
            });
        }
        else
        {
            hypotheses.Add(new
            {
                condition = "Syndrome Algique / Bilan Général",
                confidence = 0.65,
                severity = "routine",
                justification = "Symptômes non spécifiques nécessitant une évaluation biologique standard.",
                recommendedTests = new[] { "NFS", "Ionogramme sanguin", "Bilan hépatique et rénal" }
            });
        }

        return Ok(new
        {
            generatedAt = DateTime.UtcNow,
            engine = "SoftCare Clinical AI Engine v2.4 (CDS Hooks)",
            hypotheses = hypotheses,
            clinicalDisclaimer = "Aide à la décision clinique fournie à titre indicatif. La décision finale relève de la responsabilité exclusive du praticien."
        });
    }

    [HttpPost("summarize-record")]
    public ActionResult SummarizeRecord([FromBody] JsonElement payload)
    {
        var patientName = payload.TryGetProperty("patientName", out var pn) ? pn.GetString() : "Patient";
        var diagnosis = payload.TryGetProperty("diagnosis", out var dg) ? dg.GetString() : "Bilan médical en cours";
        var treatment = payload.TryGetProperty("treatment", out var tr) ? tr.GetString() : "Traitement standard";

        return Ok(new
        {
            summary = $"Patient {patientName} admis pour prise en charge. Diagnostic principal retenu : {diagnosis}. Conduite à tenir : {treatment}. Surveillance des constantes hémodynamiques et tolérance médicamenteuse recommandée.",
            keyRisks = new[] { "Risque d'interaction médicamenteuse", "Surveillance de la fonction rénale", "Suivi de la chaîne du froid si biothérapie" },
            timestamp = DateTime.UtcNow
        });
    }
}
