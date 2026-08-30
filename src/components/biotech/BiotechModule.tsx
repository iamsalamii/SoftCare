import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dna, Snowflake, FlaskConical, AlertTriangle, ShieldCheck,
  Search, Plus, QrCode, Printer, FileText, CheckCircle2, ChevronRight,
  ExternalLink, Layers, Sparkles, Activity, Download
} from 'lucide-react';
import { GenomicProfile, BioSample, ClinicalTrial } from '../../types';
import { generateQrCodeSvg } from '../../utils/barcodeUtils';
import { printDocument, generateDocumentHeader, generateDocumentFooter } from '../../utils/exportUtils';

export const BiotechModule: React.FC = () => {
  const {
    genomicProfiles, pgxInteractions, bioSamples, biobankFreezers,
    clinicalTrials, organizationSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pgx' | 'biobank' | 'trials'>('pgx');
  const [selectedProfile, setSelectedProfile] = useState<GenomicProfile | null>(genomicProfiles[0] || null);
  const [selectedFreezerId, setSelectedFreezerId] = useState<string>(biobankFreezers[0]?.id || 'FRZ-80-01');
  const [selectedBioSample, setSelectedBioSample] = useState<BioSample | null>(null);

  const activeFreezer = biobankFreezers.find(f => f.id === selectedFreezerId) || biobankFreezers[0];
  const freezerSamples = bioSamples.filter(s => s.freezerId === selectedFreezerId);

  // Print Genomic Report
  const handlePrintGenomicReport = async (profile: GenomicProfile) => {
    const geneRows = profile.genes.map(g => `
      <tr>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #0891b2;">${g.gene}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-family: monospace;">${g.diplotype}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${g.phenotype}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 11px; color: #475569;">${g.clinicalImpact}</td>
      </tr>
    `).join('');

    const recommendationsList = profile.recommendations.map(r => `
      <li style="margin-bottom: 8px; color: #0f172a; font-weight: 500;">${r}</li>
    `).join('');

    const html = `
      ${generateDocumentHeader(organizationSettings, 'report', `PGX-${profile.id}`)}
      <div style="margin: 20px 0; padding: 15px; background: #ecfeff; border-left: 4px solid #06b6d4; border-radius: 6px;">
        <h2 style="margin: 0 0 6px 0; color: #0e7490;">🧬 Rapport de Pharmacogénomique & Médecine Personnalisée</h2>
        <p style="margin: 0; color: #0891b2; font-size: 13px;">
          Patient : <strong>${profile.patientName || 'N/A'}</strong> | Date de l'analyse : <strong>${new Date(profile.testDate).toLocaleDateString('fr-FR')}</strong> | Panel : <strong>${profile.panelName}</strong>
        </p>
      </div>

      <h3 style="color: #1e293b; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">1. Profil Génétique & Allèles Identifiés</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;">
        <thead>
          <tr style="background: #f8fafc; text-align: left; color: #475569;">
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Gène Cible</th>
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Diplotype / Génotype</th>
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Phénotype Métabolique</th>
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Impact Clinique</th>
          </tr>
        </thead>
        <tbody>${geneRows}</tbody>
      </table>

      <h3 style="color: #1e293b; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">2. Recommandations Thérapeutiques & Ajustements Posologiques (CPIC / DPWG)</h3>
      <ul style="padding-left: 20px; font-size: 13px; line-height: 1.6;">
        ${recommendationsList}
      </ul>

      <div style="margin-top: 30px; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 6px; font-size: 11px; color: #64748b; background: #f8fafc;">
        <strong>Notice de conformité :</strong> Ce rapport est conforme aux directives internationales de pharmacogénétique CPIC et DPWG. Les données sont intégrées au système d'aide à la décision clinique SoftCare.
      </div>
      ${generateDocumentFooter(organizationSettings)}
    `;

    await printDocument(html, organizationSettings, `Rapport-PGx-${profile.patientName || 'Patient'}`);
  };

  // Print BioSample QR Label
  const handlePrintSampleLabel = async (sample: BioSample) => {
    const qrSvg = generateQrCodeSvg(`SOFTCARE-BIOBANK|${sample.sampleCode}|${sample.sampleType}|TEMP:${sample.storageTemp}|LOC:${sample.freezerId}-${sample.rackNumber}-${sample.boxNumber}-${sample.wellPosition}`, { size: 90 });

    const labelHtml = `
      <div style="width: 280px; font-family: monospace; border: 2px solid #06b6d4; padding: 10px; border-radius: 8px; margin: 20px auto; background: white;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
          <strong style="color: #0891b2; font-size: 11px;">🏥 BIOBANQUE SOFTCARE</strong>
          <span style="background: #06b6d4; color: white; padding: 1px 4px; border-radius: 3px; font-size: 9px; font-weight: bold;">${sample.storageTemp}</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <div style="flex: 1; font-size: 10px; line-height: 1.4;">
            <div><strong>Code :</strong> ${sample.sampleCode}</div>
            <div><strong>Type :</strong> ${sample.sampleType}</div>
            <div><strong>Patient :</strong> ${sample.patientName || 'Anonymisé'}</div>
            <div><strong>Empl. :</strong> ${sample.freezerId} / ${sample.wellPosition}</div>
            <div><strong>Date :</strong> ${sample.collectionDate}</div>
          </div>
          <div>${qrSvg}</div>
        </div>
      </div>
    `;

    await printDocument(labelHtml, organizationSettings, `Etiquette-Biobank-${sample.sampleCode}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Module - SoftCare Clean Cyan / Teal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg shadow-teal-600/15">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <Dna className="w-7 h-7 text-cyan-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Biotechnologies & Médecine de Précision</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/20 border border-white/30 text-cyan-50 rounded-full">
                PGx & LIMS
              </span>
            </div>
            <p className="text-xs text-cyan-100/90 mt-0.5">
              Pharmacogénomique (PGx), Biobanque cryogénique (-80°C / -196°C) et Essais cliniques translationnels.
            </p>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div className="flex bg-black/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pgx')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'pgx' ? 'bg-white text-teal-800 shadow-md font-bold' : 'text-cyan-100 hover:text-white'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Pharmacogénomique (PGx)</span>
          </button>
          <button
            onClick={() => setActiveTab('biobank')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'biobank' ? 'bg-white text-teal-800 shadow-md font-bold' : 'text-cyan-100 hover:text-white'
            }`}
          >
            <Snowflake className="w-4 h-4" />
            <span>Biobanque & LIMS</span>
          </button>
          <button
            onClick={() => setActiveTab('trials')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'trials' ? 'bg-white text-teal-800 shadow-md font-bold' : 'text-cyan-100 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Essais Cliniques</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PHARMACOGÉNOMIQUE (PGx) */}
      {/* ========================================================================= */}
      {activeTab === 'pgx' && (
        <div className="space-y-6">
          {/* Quick PGx Clinical Decision Support Banner */}
          <div className="bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 border border-cyan-200/80 rounded-3xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-teal-950">Aide à la Décision Clinique Pharmacogénomique Active</h3>
                  <p className="text-xs text-teal-800/80">
                    Les prescriptions et délivrances sont automatiquement confrontées aux génotypes (*CYP2C19, CYP2D6, DPYD, SLCO1B1*).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 bg-white/90 px-3.5 py-1.5 rounded-xl border border-teal-200 shadow-xs">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Normes CPIC & Guidelines DPWG intégrées</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Patient Genomic Profiles */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900">Profils Génomiques Patients</h3>
                <span className="text-xs bg-cyan-100 text-cyan-800 font-bold px-2.5 py-0.5 rounded-full">
                  {genomicProfiles.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {genomicProfiles.map(profile => {
                  const isSelected = selectedProfile?.id === profile.id;
                  return (
                    <button
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-50/90 to-teal-50/90 border-teal-300 shadow-sm ring-2 ring-teal-500/20'
                          : 'bg-white border-gray-100 hover:border-cyan-200 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-xs text-gray-900">{profile.patientName}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Validé Labo
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-700 font-medium truncate">{profile.panelName}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono">
                        Date: {new Date(profile.testDate).toLocaleDateString('fr-FR')}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Detail View */}
            {selectedProfile && (
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                      {selectedProfile.panelName}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedProfile.patientName}</h2>
                    <p className="text-xs text-gray-500">
                      Analyse validée le {new Date(selectedProfile.testDate).toLocaleDateString('fr-FR')} par le Laboratoire de Génétique.
                    </p>
                  </div>

                  <button
                    onClick={() => handlePrintGenomicReport(selectedProfile)}
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer Rapport PGx</span>
                  </button>
                </div>

                {/* Identified Genes Matrix */}
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Dna className="w-4 h-4 text-cyan-600" />
                    <span>Variantes Génétiques & Phénotypes Métaboliques</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedProfile.genes.map((gene, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/80 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-sm text-teal-900">{gene.gene}</span>
                          <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-700">
                            {gene.diplotype}
                          </span>
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          gene.phenotype.includes('Poor') || gene.phenotype.includes('Ultra-rapid') || gene.phenotype.includes('Pathogenic')
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {gene.phenotype}
                        </span>
                        <p className="text-[11px] text-gray-600 leading-tight pt-1 border-t border-gray-200/60">
                          {gene.clinicalImpact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-5 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border border-teal-100 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Recommandations Thérapeutiques Personnalisées</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-teal-950">
                    {selectedProfile.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BIOBANQUE & LIMS CRIOGÉNIQUE */}
      {/* ========================================================================= */}
      {activeTab === 'biobank' && (
        <div className="space-y-6">
          {/* Freezer Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {biobankFreezers.map(freezer => {
              const isSelected = selectedFreezerId === freezer.id;
              const usedPercent = Math.round((freezer.usedBoxes / freezer.capacityBoxes) * 100);
              return (
                <button
                  key={freezer.id}
                  onClick={() => setSelectedFreezerId(freezer.id)}
                  className={`p-5 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-600 to-teal-700 text-white border-transparent shadow-xl shadow-teal-700/20'
                      : 'bg-white text-gray-900 border-gray-100 hover:border-teal-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-cyan-50 text-cyan-600'
                    }`}>
                      <Snowflake className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isSelected ? 'bg-white text-teal-900' : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {freezer.temperature}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm leading-snug">{freezer.name}</h3>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-cyan-100' : 'text-gray-500'}`}>
                      {freezer.location}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className={isSelected ? 'text-cyan-100' : 'text-gray-500'}>Remplissage</span>
                      <span className="font-bold">{freezer.usedBoxes} / {freezer.capacityBoxes} boîtes ({usedPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200/40 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-white h-full rounded-full" style={{ width: `${usedPercent}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Freezer Samples Map & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2D Plate Visualizer */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  <span>Grille Cryotubes 2D (Boîte Standard)</span>
                </h3>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">Format 8x8</span>
              </div>

              {/* Grid 8x8 representation */}
              <div className="grid grid-cols-8 gap-1.5 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                {Array.from({ length: 64 }).map((_, idx) => {
                  const rowLetter = String.fromCharCode(65 + Math.floor(idx / 8));
                  const colNumber = (idx % 8) + 1;
                  const wellCode = `${rowLetter}0${colNumber}`;
                  const hasSample = freezerSamples.find(s => s.wellPosition === wellCode);

                  return (
                    <button
                      key={idx}
                      onClick={() => hasSample && setSelectedBioSample(hasSample)}
                      title={`Puits ${wellCode} ${hasSample ? `(${hasSample.sampleType} - ${hasSample.patientName})` : '(Vide)'}`}
                      className={`h-7 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
                        hasSample
                          ? hasSample.sampleType === 'DNA'
                            ? 'bg-cyan-500 text-white shadow-sm hover:scale-110 ring-1 ring-white'
                            : hasSample.sampleType === 'Tissue Biopsy'
                            ? 'bg-rose-500 text-white shadow-sm hover:scale-110 ring-1 ring-white'
                            : 'bg-teal-500 text-white shadow-sm hover:scale-110 ring-1 ring-white'
                          : 'bg-slate-800/60 text-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {wellCode}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span>ADN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>ARN / Sérum</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Tissu Biopsie</span>
                </div>
              </div>
            </div>

            {/* Samples Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900">
                  Échantillons dans {activeFreezer?.name}
                </h3>
                <span className="text-xs bg-cyan-100 text-cyan-800 font-bold px-2.5 py-0.5 rounded-full">
                  {freezerSamples.length} cryotubes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Code Échantillon</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Coordonnées</th>
                      <th className="px-4 py-3">Consentement</th>
                      <th className="px-4 py-3 text-right">Étiquette QR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {freezerSamples.map(sample => (
                      <tr key={sample.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-teal-900">
                          {sample.sampleCode}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                            {sample.sampleType}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{sample.patientName}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-gray-600">
                          {sample.rackNumber} / {sample.wellPosition}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Éclairé
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handlePrintSampleLabel(sample)}
                            className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="Imprimer étiquette cryotube QR"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ESSAIS CLINIQUES & RECHERCHE TRANSLATIONNELLE */}
      {/* ========================================================================= */}
      {activeTab === 'trials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clinicalTrials.map(trial => {
              const progress = Math.round((trial.currentEnrollment / trial.targetEnrollment) * 100);
              return (
                <div key={trial.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-cyan-100 text-cyan-800 rounded-lg">
                        {trial.code} • {trial.phase}
                      </span>
                      <h3 className="font-bold text-base text-gray-900 leading-snug pt-1">
                        {trial.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                      {trial.status === 'recruiting' ? 'Recrutement Actif' : trial.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">{trial.description}</p>

                  <div className="p-3 bg-gray-50 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Investigateur Principal :</span>
                      <strong className="text-gray-900">{trial.principalInvestigator}</strong>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Inclusions :</span>
                      <strong className="text-teal-700">{trial.currentEnrollment} / {trial.targetEnrollment} patients ({progress}%)</strong>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {/* Inclusion Criteria */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Critères d'Inclusion Principaux
                    </span>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {trial.inclusionCriteria.map((crit, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BiotechModule;
