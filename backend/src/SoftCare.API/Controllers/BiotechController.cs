using System;
using System.Collections.Generic;
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
public class BiotechController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public BiotechController(IApplicationDbContext context)
    {
        _context = context;
    }

    // === PHARMACOGENOMICS (PGx) ===

    [HttpGet("genomics")]
    public async Task<ActionResult> GetGenomicProfiles()
    {
        var profiles = await _context.GenomicProfiles
            .Where(g => g.IsActive)
            .OrderByDescending(g => g.TestDate)
            .ToListAsync();

        return Ok(profiles.Select(p => MapGenomicDto(p)));
    }

    [HttpGet("genomics/patient/{patientId}")]
    public async Task<ActionResult> GetPatientGenomics(string patientId)
    {
        var profile = await _context.GenomicProfiles
            .FirstOrDefaultAsync(g => g.PatientId == patientId && g.IsActive);

        if (profile == null) return NotFound(new { message = "Aucun profil génomique pour ce patient." });
        return Ok(MapGenomicDto(profile));
    }

    [HttpPost("genomics")]
    public async Task<ActionResult> CreateGenomicProfile([FromBody] JsonElement payload)
    {
        var profile = new GenomicProfile
        {
            Id = Guid.NewGuid().ToString(),
            PatientId = payload.TryGetProperty("patientId", out var pid) ? pid.GetString() ?? "" : "",
            PatientName = payload.TryGetProperty("patientName", out var pn) ? pn.GetString() ?? "" : "",
            TestDate = payload.TryGetProperty("testDate", out var td) && DateTime.TryParse(td.GetString(), out var dt) ? DateTime.SpecifyKind(dt, DateTimeKind.Utc) : DateTime.UtcNow,
            PanelName = payload.TryGetProperty("panelName", out var pnl) ? pnl.GetString() ?? "Panel PGx Général" : "Panel PGx Général",
            GenesJson = payload.TryGetProperty("genes", out var genes) ? genes.GetRawText() : "[]",
            PhenotypesJson = payload.TryGetProperty("phenotypes", out var pheno) ? pheno.GetRawText() : "{}",
            RecommendationsJson = payload.TryGetProperty("recommendations", out var recs) ? recs.GetRawText() : "[]",
            Status = "validated",
            Notes = payload.TryGetProperty("notes", out var nt) ? nt.GetString() : null
        };

        _context.GenomicProfiles.Add(profile);
        await _context.SaveChangesAsync();

        return Ok(MapGenomicDto(profile));
    }

    // === BIOBANK & LIMS ===

    [HttpGet("biobank/freezers")]
    public async Task<ActionResult> GetFreezers()
    {
        var freezers = await _context.BiobankFreezers.Where(f => f.IsActive).ToListAsync();
        return Ok(freezers);
    }

    [HttpGet("biobank/samples")]
    public async Task<ActionResult> GetBioSamples([FromQuery] string? freezerId = null)
    {
        var query = _context.BioSamples.Where(s => s.IsActive);
        if (!string.IsNullOrEmpty(freezerId))
        {
            query = query.Where(s => s.FreezerId == freezerId);
        }

        var samples = await query.OrderBy(s => s.SampleCode).ToListAsync();
        return Ok(samples);
    }

    [HttpGet("biobank/samples/scan/{code}")]
    public async Task<ActionResult> ScanBioSample(string code)
    {
        var cleanCode = code.Trim().ToUpper();
        var sample = await _context.BioSamples.FirstOrDefaultAsync(s => s.SampleCode.ToUpper() == cleanCode && s.IsActive);
        if (sample == null) return NotFound(new { message = $"Échantillon {code} introuvable en biobanque." });
        return Ok(sample);
    }

    [HttpPost("biobank/samples")]
    public async Task<ActionResult> CreateBioSample([FromBody] BioSample sample)
    {
        sample.Id = Guid.NewGuid().ToString();
        if (string.IsNullOrEmpty(sample.SampleCode))
        {
            sample.SampleCode = $"BS-{DateTime.UtcNow.Year}-{sample.SampleType}-{new Random().Next(1000, 9999)}";
        }
        sample.CollectionDate = DateTime.SpecifyKind(sample.CollectionDate, DateTimeKind.Utc);
        _context.BioSamples.Add(sample);
        await _context.SaveChangesAsync();

        return Ok(sample);
    }

    // === CLINICAL TRIALS ===

    [HttpGet("trials")]
    public async Task<ActionResult> GetClinicalTrials()
    {
        var trials = await _context.ClinicalTrials.Where(t => t.IsActive).ToListAsync();
        return Ok(trials.Select(t => MapTrialDto(t)));
    }

    [HttpPost("trials")]
    public async Task<ActionResult> CreateTrial([FromBody] JsonElement payload)
    {
        var trial = new ClinicalTrial
        {
            Id = Guid.NewGuid().ToString(),
            Code = payload.TryGetProperty("code", out var cd) ? cd.GetString() ?? "" : $"CT-{DateTime.UtcNow.Year}-{new Random().Next(100, 999)}",
            Title = payload.TryGetProperty("title", out var tt) ? tt.GetString() ?? "" : "",
            Phase = payload.TryGetProperty("phase", out var ph) ? ph.GetString() ?? "Phase II" : "Phase II",
            PrincipalInvestigator = payload.TryGetProperty("principalInvestigator", out var pi) ? pi.GetString() ?? "" : "",
            TargetEnrollment = payload.TryGetProperty("targetEnrollment", out var te) ? te.GetInt32() : 50,
            CurrentEnrollment = payload.TryGetProperty("currentEnrollment", out var ce) ? ce.GetInt32() : 0,
            StartDate = payload.TryGetProperty("startDate", out var sd) && DateTime.TryParse(sd.GetString(), out var sdt) ? DateTime.SpecifyKind(sdt, DateTimeKind.Utc) : DateTime.UtcNow,
            Status = "recruiting",
            Description = payload.TryGetProperty("description", out var ds) ? ds.GetString() ?? "" : "",
            InclusionCriteriaJson = payload.TryGetProperty("inclusionCriteria", out var inc) ? inc.GetRawText() : "[]",
            ExclusionCriteriaJson = payload.TryGetProperty("exclusionCriteria", out var exc) ? exc.GetRawText() : "[]"
        };

        _context.ClinicalTrials.Add(trial);
        await _context.SaveChangesAsync();

        return Ok(MapTrialDto(trial));
    }

    private static object MapGenomicDto(GenomicProfile p)
    {
        object genes = new object[] { };
        object phenotypes = new Dictionary<string, string>();
        object recommendations = new string[] { };

        try { genes = JsonSerializer.Deserialize<object>(p.GenesJson) ?? genes; } catch { }
        try { phenotypes = JsonSerializer.Deserialize<object>(p.PhenotypesJson) ?? phenotypes; } catch { }
        try { recommendations = JsonSerializer.Deserialize<object>(p.RecommendationsJson) ?? recommendations; } catch { }

        return new
        {
            id = p.Id,
            patientId = p.PatientId,
            patientName = p.PatientName,
            testDate = p.TestDate.ToString("yyyy-MM-dd"),
            panelName = p.PanelName,
            genes = genes,
            phenotypes = phenotypes,
            recommendations = recommendations,
            status = p.Status,
            notes = p.Notes
        };
    }

    private static object MapTrialDto(ClinicalTrial t)
    {
        object inclusion = new string[] { };
        object exclusion = new string[] { };

        try { inclusion = JsonSerializer.Deserialize<object>(t.InclusionCriteriaJson) ?? inclusion; } catch { }
        try { exclusion = JsonSerializer.Deserialize<object>(t.ExclusionCriteriaJson) ?? exclusion; } catch { }

        return new
        {
            id = t.Id,
            code = t.Code,
            title = t.Title,
            phase = t.Phase,
            principalInvestigator = t.PrincipalInvestigator,
            targetEnrollment = t.TargetEnrollment,
            currentEnrollment = t.CurrentEnrollment,
            startDate = t.StartDate.ToString("yyyy-MM-dd"),
            status = t.Status,
            description = t.Description,
            inclusionCriteria = inclusion,
            exclusionCriteria = exclusion
        };
    }
}
