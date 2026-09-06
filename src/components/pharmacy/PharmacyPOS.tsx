import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote,
  Receipt, Printer, ScanLine, X, CheckCircle, AlertTriangle, Package,
  Dna, ShieldAlert, UserCheck, Sparkles
} from 'lucide-react';
import { PharmacySaleItem, PharmacySale, Medication } from '../../types';
import { formatCurrency, generateReceiptHTML, printDocument } from '../../utils/exportUtils';
import BarcodeScannerModal from '../common/BarcodeScannerModal';

const PharmacyPOS: React.FC = () => {
  const {
    medications, organizationSettings, addPharmacySale, addMedicationMovement,
    currentUser, patients, genomicProfiles, pgxInteractions
  } = useApp();

  const [cart, setCart] = useState<PharmacySaleItem[]>([]);
  const [search, setSearch] = useState('');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [completed, setCompleted] = useState<PharmacySale | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setCustomerName(`${patient.firstName} ${patient.lastName}`);
        setCustomerPhone(patient.phone || '');
      }
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientGenomicProfile = selectedPatient ? genomicProfiles.find(g => g.patientId === selectedPatient.id) : null;

  // Real-time Pharmacogenomic (PGx) Safety Interceptor
  const activePgxAlerts = cart.map(item => {
    const med = medications.find(m => m.id === item.medicationId);
    if (!med || !patientGenomicProfile) return null;

    // Check against PGx rules
    if (med.name.toLowerCase().includes('plavix') || med.genericName?.toLowerCase().includes('clopidogrel')) {
      if (patientGenomicProfile.phenotypes['CYP2C19']?.includes('Lent') || patientGenomicProfile.phenotypes['CYP2C19']?.includes('Poor')) {
        return {
          medicationName: med.name,
          gene: 'CYP2C19',
          phenotype: patientGenomicProfile.phenotypes['CYP2C19'],
          riskLevel: 'contraindicated',
          alert: 'ALERTE PGx CRITIQUE : Le patient est métaboliseur lent CYP2C19 (*2/*2). Le Clopidogrel est inefficace. Risque majeur de thrombose post-angioplastie.',
          recommendation: 'Privilégier Ticagrélor (Brilique) ou Prasugrel (Efient).'
        };
      }
    }

    if (med.name.toLowerCase().includes('codéine') || med.name.toLowerCase().includes('codoliprane')) {
      if (patientGenomicProfile.phenotypes['CYP2D6']?.includes('Ultra-Rapide') || patientGenomicProfile.phenotypes['CYP2D6']?.includes('Ultra-rapid')) {
        return {
          medicationName: med.name,
          gene: 'CYP2D6',
          phenotype: patientGenomicProfile.phenotypes['CYP2D6'],
          riskLevel: 'contraindicated',
          alert: 'ALERTE PGx TOXICITÉ : Métaboliseur ultra-rapide CYP2D6 (*1/*2xN). Risque de surdosage aigu en morphine libre et détresse respiratoire.',
          recommendation: 'Contre-indication absolue à la codéine. Utiliser Paracétamol seul ou AINS.'
        };
      }
    }

    return null;
  }).filter(Boolean);

  const filteredMeds = medications.filter(m => {
    const term = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      (m.genericName && m.genericName.toLowerCase().includes(term)) ||
      (m.barcode && m.barcode.includes(search)) ||
      (m.batchNumber && m.batchNumber.toLowerCase().includes(term))
    );
  });

  const addToCart = (medicationId: string, barcode?: string) => {
    const med = medications.find(m => m.id === medicationId);
    if (!med) return;

    if (med.stock <= 0) {
      alert('Stock insuffisant pour ce médicament !');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.medicationId === medicationId);
      if (existing) {
        if (existing.quantity >= med.stock) {
          alert('Stock maximum disponible atteint !');
          return prev;
        }
        return prev.map(item =>
          item.medicationId === medicationId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }
      return [...prev, {
        id: Date.now().toString(),
        medicationId,
        medicationName: med.name,
        barcode: barcode || med.barcode,
        quantity: 1,
        unitPrice: med.price || med.unitPrice || 0,
        total: med.price || med.unitPrice || 0
      }];
    });
    setSearch('');
  };

  const handleScanSuccess = (med: Medication) => {
    addToCart(med.id, med.barcode);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const item = cart.find(i => i.id === id);
    const med = medications.find(m => m.id === item?.medicationId);

    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
      return;
    }

    if (med && quantity > med.stock) {
      alert(`Stock insuffisant ! Maximum disponible : ${med.stock}`);
      return;
    }

    setCart(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedPatientId('');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(subtotal * (organizationSettings.taxRate / 100) * 100) / 100;
  const total = subtotal + tax;
  const change = Math.max(0, amountReceived - total);

  const handlePayment = () => {
    if (cart.length === 0) return;

    const cashier = currentUser || { id: '1', name: 'Pharmacien de garde' };

    const sale: PharmacySale = {
      id: Date.now().toString(),
      items: cart,
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod,
      amountReceived: paymentMethod === 'cash' ? amountReceived : total,
      change: paymentMethod === 'cash' ? change : 0,
      customerId: selectedPatientId,
      customerName: customerName || 'Client Comptoir',
      customerPhone,
      cashierId: cashier.id,
      cashierName: cashier.name,
      createdAt: new Date().toISOString(),
      receiptNumber: `REC-${Date.now().toString().slice(-8)}`
    };

    addPharmacySale(sale);

    cart.forEach(item => {
      addMedicationMovement({
        id: Date.now().toString() + item.medicationId,
        medicationId: item.medicationId,
        type: 'out',
        quantity: item.quantity,
        reason: `Délivrance Vente Comptoir ${sale.receiptNumber}`,
        performedBy: cashier.id,
        date: new Date().toISOString(),
        referenceId: sale.id
      });
    });

    setCompleted(sale);
    setShowPayment(false);
  };

  const handleNewSale = () => {
    setCompleted(null);
    clearCart();
    setAmountReceived(0);
  };

  const handlePrintReceipt = async (sale: PharmacySale, format: 'thermal' | 'a4' = 'thermal') => {
    const content = generateReceiptHTML(
      {
        number: sale.receiptNumber,
        date: sale.createdAt,
        customerName: sale.customerName || 'Client Comptoir',
        items: sale.items.map(i => ({ name: i.medicationName, quantity: i.quantity, price: i.unitPrice, total: i.total })),
        subtotal: sale.subtotal,
        tax: sale.tax,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        amountReceived: sale.amountReceived || sale.total,
        change: sale.change || 0
      },
      organizationSettings,
      format
    );

    await printDocument(content, organizationSettings, `Recu-${sale.receiptNumber}-${format}`);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-0.5">Délivrance Enregistrée avec Succès !</h2>
          <p className="text-xs text-gray-500 mb-5 font-mono">Ticket N° : {completed.receiptNumber}</p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-left border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Client / Patient :</span>
              <span className="font-bold text-gray-900">{completed.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mode de règlement :</span>
              <span className="font-semibold capitalize text-gray-800">{completed.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 text-sm">
              <span className="font-bold text-gray-800">Total Payé :</span>
              <span className="font-bold text-cyan-600">{formatCurrency(completed.total)}</span>
            </div>
            {completed.change > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Monnaie rendue :</span>
                <span>{formatCurrency(completed.change)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handlePrintReceipt(completed, 'thermal')}
                className="py-3 px-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Ticket Caisse (80mm)</span>
              </button>
              <button
                onClick={() => handlePrintReceipt(completed, 'a4')}
                className="py-3 px-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Facture A4 (Grand Format)</span>
              </button>
            </div>

            <button
              onClick={handleNewSale}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
            >
              Nouvelle Vente Comptoir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-200">
      {/* Products Left Panel */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* POS Header & Search */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Point de Vente Pharmacie</h1>
              <p className="text-xs text-gray-500">Délivrance rapide, scan de code-barres et contrôle génomique.</p>
            </div>

            {/* Patient Selector for Pharmacogenomics safety */}
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <select
                value={selectedPatientId}
                onChange={(e) => handlePatientSelect(e.target.value)}
                className="px-3 py-2 bg-purple-50/70 border border-purple-200 text-purple-950 font-medium rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              >
                <option value="">Sélectionner un Patient (Contrôle PGx)</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} {genomicProfiles.some(g => g.patientId === p.id) ? '🧬 [Profil PGx]' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search + Barcode Scanner Trigger */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher par nom, code CIP, lot..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowScannerModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <ScanLine className="w-4 h-4 text-cyan-400" />
              <span>Scanner Douchette</span>
            </button>
          </div>
        </div>

        {/* Pharmacogenomic Alert Banner if conflicts exist */}
        {activePgxAlerts.length > 0 && (
          <div className="m-4 p-4 bg-rose-50 border border-rose-300 rounded-2xl animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-rose-900 flex items-center gap-2">
                  <span>INTERACTION PHARMACOGÉNOMIQUE DÉTECTÉE</span>
                  <span className="px-2 py-0.5 bg-rose-200 text-rose-800 rounded-full text-[10px]">
                    Patient : {selectedPatient?.firstName} {selectedPatient?.lastName}
                  </span>
                </h4>
                {activePgxAlerts.map((alert, idx) => (
                  <div key={idx} className="text-rose-800 pt-1">
                    <p className="font-semibold">{alert?.alert}</p>
                    <p className="text-[11px] text-rose-700 italic">💡 Recommandation clinique : {alert?.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredMeds.map((med) => {
              const isLowStock = med.stock <= med.minStock;
              return (
                <button
                  key={med.id}
                  onClick={() => addToCart(med.id)}
                  disabled={med.stock <= 0}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    med.stock <= 0
                      ? 'bg-gray-50 border-gray-200 opacity-40 cursor-not-allowed'
                      : 'bg-white border-gray-100 hover:border-cyan-300 hover:shadow-md hover:scale-[1.02]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        med.isBiotech ? 'bg-purple-100 text-purple-700' : 'bg-cyan-50 text-cyan-600'
                      }`}>
                        {med.isBiotech ? <Dna className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        med.stock <= 0
                          ? 'bg-gray-200 text-gray-600'
                          : isLowStock
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {med.stock} en stock
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-xs truncate">{med.name}</h3>
                    <p className="text-[10px] text-gray-500 truncate mb-2">{med.genericName || med.category}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-700">{formatCurrency(med.price || med.unitPrice || 0)}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{med.barcode?.slice(-6) || 'CODE'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart Right Panel */}
      <div className="w-full lg:w-96 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Cart Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-cyan-600" />
              <span>Panier en cours ({cart.length})</span>
            </h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
              >
                Vider le panier
              </button>
            )}
          </div>

          {/* Customer info fields */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nom du client / patient..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-medium">Panier vide</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Scannez un code-barres ou cliquez sur un médicament.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{item.medicationName}</h4>
                    <p className="text-[10px] text-gray-500">{formatCurrency(item.unitPrice)} / unité</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-0.5 text-gray-600 hover:text-gray-900"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-0.5 text-gray-600 hover:text-gray-900"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-bold text-xs text-gray-900">{formatCurrency(item.total)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Payment Button */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-3">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Sous-total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>TVA ({organizationSettings.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total TTC</span>
              <span className="text-base text-cyan-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-4 h-4" />
            <span>Encaisser & Délivrer ({formatCurrency(total)})</span>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Règlement de la commande</h2>
              <button onClick={() => setShowPayment(false)} className="p-1 rounded-xl text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 bg-gray-50 rounded-2xl border border-gray-100 mb-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Montant total à régler</p>
              <p className="text-3xl font-extrabold text-cyan-600 mt-1">{formatCurrency(total)}</p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {(['cash', 'card', 'transfer'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-2xl border-2 transition-all text-center ${
                    paymentMethod === method
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900'
                      : 'border-gray-100 hover:border-gray-200 text-gray-700'
                  }`}
                >
                  {method === 'cash' && <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-600" />}
                  {method === 'card' && <CreditCard className="w-5 h-5 mx-auto mb-1 text-cyan-600" />}
                  {method === 'transfer' && <Receipt className="w-5 h-5 mx-auto mb-1 text-purple-600" />}
                  <span className="text-xs font-semibold capitalize">
                    {method === 'cash' ? 'Espèces' : method === 'card' ? 'Carte' : 'Virement'}
                  </span>
                </button>
              ))}
            </div>

            {/* Cash Input */}
            {paymentMethod === 'cash' && (
              <div className="space-y-3 mb-5">
                <label className="block text-xs font-semibold text-gray-700">
                  Espèces reçues ({organizationSettings.currencySymbol || '€'})
                </label>
                <input
                  type="number"
                  value={amountReceived || ''}
                  onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-center focus:bg-white"
                  placeholder="0.00"
                />
                {amountReceived >= total && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <span className="text-xs text-emerald-700 font-medium">Monnaie à rendre :</span>
                    <p className="text-xl font-bold text-emerald-700">{formatCurrency(change)}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentMethod === 'cash' && amountReceived < total}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-500/25 transition-all disabled:opacity-40"
            >
              Confirmer et imprimer le ticket
            </button>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal for POS */}
      <BarcodeScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleScanSuccess}
        title="Scanner pour Ajout au Panier"
        description="Passez le code-barres de la boîte devant la douchette pour l'ajouter directement."
      />
    </div>
  );
};

export default PharmacyPOS;
