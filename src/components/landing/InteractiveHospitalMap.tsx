import React, { useState, useEffect } from 'react';
import { 
  Activity, BedDouble, TestTube, Cross, 
  Microscope, Pill, HeartPulse, Stethoscope, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

type Department = 'urgences' | 'chirurgie' | 'laboratoire' | 'imagerie' | 'hospitalisation' | 'pharmacie';

const DEPARTMENTS = [
  { id: 'urgences', label: 'Urgences', icon: Activity, color: '#ef4444', x: 20, y: 30 },
  { id: 'imagerie', label: 'Imagerie', icon: Microscope, color: '#10b981', x: 20, y: 70 },
  { id: 'laboratoire', label: 'Laboratoire', icon: TestTube, color: '#a855f7', x: 50, y: 15 },
  { id: 'pharmacie', label: 'Pharmacie', icon: Pill, color: '#f59e0b', x: 50, y: 85 },
  { id: 'chirurgie', label: 'Bloc Opératoire', icon: Cross, color: '#06b6d4', x: 80, y: 30 },
  { id: 'hospitalisation', label: 'Hospitalisation', icon: BedDouble, color: '#3b82f6', x: 80, y: 70 },
];

export const InteractiveHospitalMap: React.FC = () => {
  const [activeDept, setActiveDept] = useState<Department | null>(null);
  
  // Synthetic Data for charts
  const [timeSeries, setTimeSeries] = useState(Array.from({length: 10}, (_, i) => ({ time: `${10+i}:00`, patients: Math.floor(Math.random() * 20) + 10 })));
  
  const [stats, setStats] = useState({
    urgences: { patients: 12, waitTime: 45 },
    chirurgie: { active: 3, progress: 65 },
    laboratoire: { tests: 124, processing: 15 },
    imagerie: { scans: 42, active: 2 },
    hospitalisation: { bedsOccupied: 142, total: 150 },
    pharmacie: { prescriptions: 350, preparing: 12 }
  });

  // Simulation Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        urgences: {
          ...prev.urgences,
          patients: Math.max(5, prev.urgences.patients + (Math.random() > 0.5 ? 1 : -1)),
          waitTime: Math.max(10, prev.urgences.waitTime + (Math.random() > 0.5 ? 2 : -2))
        },
        laboratoire: {
          ...prev.laboratoire,
          tests: prev.laboratoire.tests + (Math.random() > 0.3 ? 1 : 0),
          processing: Math.max(5, prev.laboratoire.processing + (Math.random() > 0.5 ? 1 : -1))
        },
        chirurgie: {
          ...prev.chirurgie,
          progress: prev.chirurgie.progress >= 100 ? 0 : prev.chirurgie.progress + 1
        }
      }));

      // Update timeseries slightly to simulate live chart
      setTimeSeries(prev => {
        const newArr = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1].patients;
        newArr.push({ time: new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}), patients: Math.max(5, lastVal + (Math.random() > 0.5 ? 2 : -2)) });
        return newArr;
      });

    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => {
    if (!activeDept) return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <HeartPulse className="w-16 h-16 mb-4 text-cyan-500/50 animate-pulse" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <p className="font-semibold text-lg text-white">Sélectionnez un pôle</p>
          <p className="text-sm mt-2 max-w-xs">Explorez les flux de patients et de données en temps réel générés par notre IA de simulation.</p>
        </div>
      </div>
    );

    if (activeDept === 'urgences') return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg"><Activity className="w-6 h-6 text-red-500" /></div>
            Urgences & Triage
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400 font-medium text-sm">Activité Haute</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Patients en attente</p>
            <p className="text-4xl font-black text-white mt-1 transition-all duration-300">{stats.urgences.patients}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-12 h-12 text-red-500" /></div>
            <p className="text-slate-400 text-sm relative z-10">Temps moyen</p>
            <p className="text-4xl font-black text-red-400 mt-1 relative z-10 transition-all duration-300">{stats.urgences.waitTime}<span className="text-lg text-red-400/70 ml-1">min</span></p>
          </div>
        </div>

        <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 min-h-[200px]">
          <p className="text-sm text-slate-300 font-semibold mb-4">Flux d'admissions (Temps réel)</p>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={timeSeries}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="patients" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );

    if (activeDept === 'chirurgie') return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg"><Cross className="w-6 h-6 text-cyan-500" /></div>
            Bloc Opératoire
          </h3>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-200 font-semibold text-lg">Intervention en cours - Salle 3</span>
            <span className="text-xs font-bold bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full animate-pulse border border-cyan-500/30">En cours</span>
          </div>
          <p className="text-sm text-slate-400 mb-4">Chirurgie Cardiaque - Patient #392</p>
          
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full relative transition-all duration-1000 ease-linear" style={{ width: `${stats.chirurgie.progress}%` }}>
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Préparation</span>
            <span>Incision</span>
            <span className="text-cyan-400">Suture</span>
            <span>Réveil</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={[{name: 'Disponibles', value: 2}, {name: 'Occupées', value: 6}]} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="value" stroke="none">
                  <Cell fill="#06b6d4" />
                  <Cell fill="#334155" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}/>
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-slate-300 mt-2">Salles occupées (75%)</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-cyan-900/10 pointer-events-none"></div>
             <div className="text-5xl font-black text-cyan-400 mb-2 relative z-10">{stats.chirurgie.active}</div>
             <p className="text-sm text-slate-400 text-center relative z-10">Interventions actives</p>
          </div>
        </div>
      </div>
    );

    if (activeDept === 'laboratoire') return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg"><TestTube className="w-6 h-6 text-purple-500" /></div>
            Laboratoire & Biotech
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
            <div className="relative w-10 h-14 border-2 border-purple-500/30 rounded-b-xl rounded-t-sm overflow-hidden flex-shrink-0">
               <div className="absolute bottom-0 w-full bg-purple-500 transition-all duration-500" style={{ height: `${(stats.laboratoire.processing / 30) * 100}%` }}>
                 <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>
                 {/* Bubble animation */}
                 <div className="absolute bottom-2 left-1 w-1 h-1 bg-white/40 rounded-full animate-[ping_2s_infinite]"></div>
                 <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-white/30 rounded-full animate-[ping_3s_infinite_1s]"></div>
               </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm leading-tight mb-1">En cours d'analyse</p>
              <p className="text-3xl font-black text-purple-400">{stats.laboratoire.processing}</p>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-slate-400 text-sm mb-1">Total analyses jour</p>
            <p className="text-3xl font-black text-white">{stats.laboratoire.tests}</p>
          </div>
        </div>

        <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-300 font-semibold mb-4">Répartition des analyses</p>
          <ResponsiveContainer width="100%" height="70%">
            <BarChart data={[{name: 'Sang', val: 45}, {name: 'Urine', val: 20}, {name: 'Génétique', val: 12}, {name: 'Cyto', val: 8}]}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="val" fill="#a855f7" radius={[4, 4, 0, 0]} isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
    
    if (activeDept === 'hospitalisation') return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg"><BedDouble className="w-6 h-6 text-blue-500" /></div>
            Hospitalisation
          </h3>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex flex-col">
            <p className="text-sm text-slate-300 font-semibold mb-3">État des Lits (Secteur A)</p>
            <div className="grid grid-cols-5 gap-2 flex-1">
              {Array.from({length: 20}).map((_, i) => (
                <div key={i} className={`rounded-sm flex items-center justify-center transition-colors duration-1000 ${i < Math.floor((stats.hospitalisation.bedsOccupied / stats.hospitalisation.total) * 20) ? 'bg-blue-500/80' : 'bg-slate-700/50'}`}></div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
             <div className="text-5xl font-black text-blue-400 mb-2 relative z-10">{Math.round((stats.hospitalisation.bedsOccupied / stats.hospitalisation.total) * 100)}%</div>
             <p className="text-sm text-slate-400 text-center relative z-10">Taux d'occupation global</p>
          </div>
        </div>
      </div>
    );

    if (activeDept === 'imagerie') return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg"><Microscope className="w-6 h-6 text-emerald-500" /></div>
            Imagerie Médicale
          </h3>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex items-center gap-6">
          <div className="relative w-24 h-24 bg-slate-900 rounded-lg border-2 border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
             <HeartPulse className="w-12 h-12 text-slate-600" />
             <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/0 via-emerald-400/40 to-emerald-400/0 h-8 w-full animate-[shimmer_1.5s_infinite_alternate]" style={{ transform: 'translateY(-100%)' }}></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-200 font-semibold">IRM en cours</span>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded animate-pulse">Acquisition</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
           <p className="text-sm text-slate-300 font-semibold mb-3">File d'attente (Scanners & IRM)</p>
           <div className="space-y-3">
             <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Patient #821</span><span className="text-emerald-400">Terminé</span></div>
             <div className="flex justify-between items-center text-sm"><span className="text-white font-medium">Patient #822</span><span className="text-emerald-400 animate-pulse">En cours</span></div>
             <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Patient #823</span><span className="text-slate-500">10 min</span></div>
           </div>
        </div>
      </div>
    );

    if (activeDept === 'pharmacie') return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg"><Pill className="w-6 h-6 text-amber-500" /></div>
            Pharmacie Centrale
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Ordonnances (Jour)</p>
            <p className="text-4xl font-black text-white mt-1">{stats.pharmacie.prescriptions}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl relative">
            <p className="text-slate-400 text-sm">En préparation</p>
            <p className="text-4xl font-black text-amber-400 mt-1">{stats.pharmacie.preparing}</p>
          </div>
        </div>

        <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-2"><AlertTriangle className="w-5 h-5 text-red-400/50 animate-pulse" /></div>
          <p className="text-sm text-slate-300 font-semibold mb-3">Alertes Stock</p>
          <div className="space-y-2">
            <div className="p-2 bg-red-900/20 border border-red-500/30 rounded flex justify-between items-center">
               <span className="text-red-400 text-sm font-medium">Paracétamol IV 1g</span>
               <span className="text-xs bg-red-500/20 text-red-400 px-2 rounded">Critique</span>
            </div>
            <div className="p-2 bg-amber-900/20 border border-amber-500/30 rounded flex justify-between items-center">
               <span className="text-amber-400 text-sm font-medium">Amoxicilline 500mg</span>
               <span className="text-xs bg-amber-500/20 text-amber-400 px-2 rounded">Faible</span>
            </div>
          </div>
        </div>
      </div>
    );

    // Fallback minimaliste si un autre département est ajouté plus tard
    return null;
  };

  return (
    <div className="bg-[#0b1120] rounded-3xl border border-cyan-900/50 p-6 shadow-2xl relative overflow-hidden">
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        .path-animated {
          stroke-dasharray: 6 6;
          animation: dash 1s linear infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0b1120] to-[#0b1120] -z-10 pointer-events-none"></div>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-cyan-400" />
          Centre Hospitalier Connecté
        </h2>
        <p className="text-slate-400 text-lg mt-2">Supervision globale, flux de données patients et analytique prédictive en temps réel.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:h-[450px]">
        
        {/* Left Side: SVG Interactive Map */}
        <div className="w-full lg:w-1/2 relative bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden min-h-[400px] lg:min-h-full">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '100%' }}>
            {/* Draw connections from all nodes to center (50, 50) */}
            {DEPARTMENTS.map(dept => (
              <line 
                key={`line-${dept.id}`}
                x1={`${dept.x}%`} y1={`${dept.y}%`} 
                x2="50%" y2="50%" 
                stroke={activeDept === dept.id ? dept.color : '#334155'} 
                strokeWidth={activeDept === dept.id ? "3" : "1.5"}
                className={activeDept === dept.id ? "path-animated" : ""}
                opacity={activeDept === dept.id ? 1 : 0.4}
              />
            ))}
          </svg>

          {/* Central Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-cyan-500/50 flex items-center justify-center relative shadow-[0_0_40px_rgba(6,182,212,0.4)]">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping opacity-50"></div>
              <Activity className="w-8 h-8 text-cyan-400 relative z-10" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-400 mt-3 bg-slate-900/90 px-3 py-1 rounded-full border border-cyan-900/50">Core</span>
          </div>

          {/* Nodes */}
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setActiveDept(dept.id as Department)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center group transition-all z-20"
              style={{ left: `${dept.x}%`, top: `${dept.y}%` }}
            >
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
                  ${activeDept === dept.id ? 'scale-110 shadow-2xl' : 'hover:scale-110 bg-slate-800 border border-slate-700/80 hover:border-slate-500'}`}
                style={{ 
                  backgroundColor: activeDept === dept.id ? dept.color : undefined,
                  boxShadow: activeDept === dept.id ? `0 0 25px ${dept.color}80` : undefined
                }}
              >
                <dept.icon className={`w-6 h-6 transition-colors ${activeDept === dept.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              </div>
              <span className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap
                ${activeDept === dept.id ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 bg-slate-900/80 border border-transparent group-hover:border-slate-700'}`}>
                {dept.label}
              </span>
            </button>
          ))}
        </div>

        {/* Right Side: Detail Dashboard */}
        <div className="w-full lg:w-1/2 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 shadow-xl relative z-10 h-[450px] overflow-hidden">
          {renderDashboard()}
        </div>

      </div>
    </div>
  );
};
