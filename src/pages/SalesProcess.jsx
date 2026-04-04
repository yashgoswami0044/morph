import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FileText, CheckCircle, XCircle, Clock, Send, Download, Plus,
  PenTool, ShieldCheck, IndianRupee, CreditCard, Upload, Eye,
  ArrowRight, AlertTriangle, Hash, User, Building, Calendar, Lock, Unlock
} from 'lucide-react';
import {
  mockEstimations, mockQuotations, mockPayments, mockContracts,
  estimationStatuses, quotationStatuses, paymentStatuses, contractStatuses, projects
} from '../data/mockData.js';

const SalesProcess = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('estimations');
  const [estimations, setEstimations] = useState(mockEstimations);
  const [quotations] = useState(mockQuotations);
  const [payments, setPayments] = useState(mockPayments);
  const [contracts] = useState(mockContracts);
  const [expandedEst, setExpandedEst] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payForm, setPayForm] = useState({ leadName: '', amount: '', mode: 'Bank Transfer', pan: '', remarks: '' });

  const formatCurrency = (n) => `₹${(n / 100000).toFixed(2)}L`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
  const formatDateTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';

  // Simulate actions
  const handleVerify = (estId) => setEstimations(prev => prev.map(e => e.id === estId ? { ...e, status: 'Verified', verifiedBy: { id: user?.email, name: user?.name || 'Manager', role: user?.role || 'Sales Manager', date: new Date().toISOString() } } : e));
  const handleAuthorize = (estId) => setEstimations(prev => prev.map(e => e.id === estId ? { ...e, status: 'Authorized', authorizedBy: { id: user?.email, name: user?.name || 'RM', role: 'Regional Manager', date: new Date().toISOString() }, digitalSignature: { signed: true, signedBy: user?.name, signedDate: new Date().toISOString() } } : e));
  const handleShareEst = (estId) => setEstimations(prev => prev.map(e => e.id === estId ? { ...e, sharedWithCustomer: true, sharedDate: new Date().toISOString(), sharedVia: 'Email + WhatsApp', status: 'Shared with Customer' } : e));

  const handleCollectPayment = () => {
    const newPay = {
      id: `PAY-${Date.now()}`, leadId: `L-new`, leadName: payForm.leadName,
      project: '-', config: '-',
      collectedBy: { id: user?.email, name: user?.name, role: user?.role },
      collectionDate: new Date().toISOString(), amount: parseFloat(payForm.amount) * 100000,
      paymentMode: payForm.mode, panNumber: payForm.pan, panVerified: false,
      remarks: payForm.remarks, receiptUploadedBy: null, receiptProvided: false,
      accountTeamReceipt: null, status: 'Collected',
    };
    setPayments(prev => [newPay, ...prev]);
    setShowPaymentModal(false);
    setPayForm({ leadName: '', amount: '', mode: 'Bank Transfer', pan: '', remarks: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>Sales Process</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Estimation → Quotation → Payment → Contract lifecycle.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { key: 'estimations', label: `Estimations (${estimations.length})`, icon: FileText },
          { key: 'quotations', label: `Quotations (${quotations.length})`, icon: Send },
          { key: 'payments', label: `Payments (${payments.length})`, icon: CreditCard },
          { key: 'contracts', label: `Contracts (${contracts.length})`, icon: PenTool },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500,
            background: activeTab === t.key ? 'var(--primary)' : 'transparent',
            color: activeTab === t.key ? 'white' : 'var(--text-muted)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}><t.icon size={14} /> {t.label}</button>
        ))}
      </div>

      {/* ── ESTIMATIONS ── */}
      {activeTab === 'estimations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {estimations.map(est => (
            <Card key={est.id} style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onClick={() => setExpandedEst(expandedEst === est.id ? null : est.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{est.id}</h3>
                      <EstStatusBadge status={est.status} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{est.leadName} · {est.project} · {est.config} · {est.area} sqft</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#34D399' }}>{formatCurrency(est.grandTotal)}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>incl. GST | Valid: {formatDate(est.validUntil)}</p>
                  </div>
                  {est.digitalSignature?.signed && <PenTool size={16} style={{ color: '#34D399' }} />}
                </div>
              </div>

              {/* Approval Chain */}
              <div style={{ padding: '12px 20px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)' }}>
                <ApprovalStep label="Created by" person={est.createdBy} />
                <ArrowRight size={14} style={{ color: 'var(--border)' }} />
                <ApprovalStep label="Verified by" person={est.verifiedBy} pending={!est.verifiedBy} />
                <ArrowRight size={14} style={{ color: 'var(--border)' }} />
                <ApprovalStep label="Authorized by" person={est.authorizedBy} pending={!est.authorizedBy} />
                {est.digitalSignature?.signed && (
                  <><ArrowRight size={14} style={{ color: 'var(--border)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PenTool size={12} style={{ color: '#34D399' }} />
                    <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>Digitally Signed</span>
                  </div></>
                )}
              </div>

              {/* Expanded: Line Items */}
              {expandedEst === est.id && (
                <div style={{ animation: 'fadeIn 0.2s' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                        {['Category', 'Description', 'Qty', 'Rate', 'Amount'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {est.items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'white' }}>{item.category}</td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{item.description}</td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{item.qty}</td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-muted)' }}>₹{item.rate.toLocaleString()}</td>
                          <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'white' }}>₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '16px 20px', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <div><span style={{ fontSize: 10, color: 'var(--text-dim)' }}>SUBTOTAL</span><p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>₹{est.totalAmount.toLocaleString()}</p></div>
                      <div><span style={{ fontSize: 10, color: 'var(--text-dim)' }}>DISCOUNT ({est.discountPercent}%)</span><p style={{ fontSize: 14, fontWeight: 600, color: '#F87171' }}>-₹{(est.totalAmount - est.finalAmount).toLocaleString()}</p></div>
                      <div><span style={{ fontSize: 10, color: 'var(--text-dim)' }}>GST (18%)</span><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>₹{est.gst.toLocaleString()}</p></div>
                      <div><span style={{ fontSize: 10, color: '#34D399' }}>GRAND TOTAL</span><p style={{ fontSize: 18, fontWeight: 700, color: '#34D399' }}>₹{est.grandTotal.toLocaleString()}</p></div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {!est.verifiedBy && <Button variant="outline" size="sm" onClick={() => handleVerify(est.id)}><CheckCircle size={14} style={{ marginRight: 4 }} /> Verify</Button>}
                      {est.verifiedBy && !est.authorizedBy && <Button variant="outline" size="sm" onClick={() => handleAuthorize(est.id)}><PenTool size={14} style={{ marginRight: 4 }} /> Authorize & Sign</Button>}
                      {est.authorizedBy && !est.sharedWithCustomer && <Button variant="primary" size="sm" onClick={() => handleShareEst(est.id)}><Send size={14} style={{ marginRight: 4 }} /> Share with Customer</Button>}
                      {est.sharedWithCustomer && <Badge variant="success" style={{ padding: '6px 12px' }}>Shared {formatDate(est.sharedDate)}</Badge>}
                      <Button variant="ghost" size="sm"><Download size={14} /> Excel</Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── QUOTATIONS ── */}
      {activeTab === 'quotations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 16, background: 'rgba(168,137,68,0.06)', border: '1px solid rgba(168,137,68,0.2)' }}>
            <p style={{ fontSize: 13, color: 'var(--primary-light)' }}>
              <PenTool size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Quotations are generated from authorized estimations. Each quotation requires a digital signature before sending to the customer.
            </p>
          </Card>
          {quotations.map(q => (
            <Card key={q.id} style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{q.id}</h3>
                    <EstStatusBadge status={q.status} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{q.leadName} · {q.project} · From: {q.estimationId}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#34D399' }}>{formatCurrency(q.grandTotal)}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Valid: {formatDate(q.validUntil)}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: 14, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                <QMini label="Payment Terms" value={q.paymentTerms} />
                <QMini label="Sent Via" value={q.sentVia || '-'} />
                <QMini label="Sent Date" value={formatDate(q.sentDate)} />
                <QMini label="Customer Response" value={q.customerResponse || 'Awaiting'} />
              </div>
              {q.digitalSignature?.signed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <PenTool size={14} style={{ color: '#34D399' }} />
                  <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Digitally signed by {q.digitalSignature.signedBy}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>{formatDateTime(q.digitalSignature.signedDate)}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {activeTab === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Card style={{ padding: 14, flex: 1, marginRight: 16, background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p style={{ fontSize: 12, color: '#F87171', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} />
                <strong>Policy:</strong> Sales team collects payment & captures PAN, but does NOT share any receipt with customer. Receipt is provided by Account team only.
              </p>
            </Card>
            <Button variant="primary" onClick={() => setShowPaymentModal(true)}>
              <Plus size={16} style={{ marginRight: 6 }} /> Record Payment
            </Button>
          </div>
          {payments.map(pay => (
            <Card key={pay.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: pay.status === 'Verified by Accounts' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pay.status === 'Verified by Accounts' ? <CheckCircle size={20} style={{ color: '#34D399' }} /> : <Clock size={20} style={{ color: '#FBBF24' }} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{pay.id}</h3>
                      <PayStatusBadge status={pay.status} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{pay.leadName} · {pay.project} · {pay.config}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>₹{pay.amount.toLocaleString()}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{pay.paymentMode} · {formatDate(pay.collectionDate)}</p>
                </div>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', gap: 20 }}>
                <QMini label="Collected By" value={`${pay.collectedBy.name} (${pay.collectedBy.role})`} />
                <QMini label="PAN" value={pay.panNumber || 'Not captured'} />
                <QMini label="PAN Verified" value={pay.panVerified ? '✅ Yes' : '❌ No'} />
                <QMini label="Remarks" value={pay.remarks} />
              </div>
              {/* Receipt Section */}
              <div style={{ padding: '12px 20px', background: 'var(--bg-main)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {pay.accountTeamReceipt ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={14} style={{ color: '#34D399' }} />
                      <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Receipt #{pay.accountTeamReceipt.receiptNo}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>by {pay.accountTeamReceipt.uploadedBy} · {formatDate(pay.accountTeamReceipt.uploadDate)}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: '#FBBF24' }}>⏳ Awaiting receipt from Account team</span>
                  )}
                </div>
                {!pay.accountTeamReceipt && user?.role === 'CRM Head' && (
                  <Button variant="outline" size="sm"><Upload size={14} style={{ marginRight: 4 }} /> Upload Receipt</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── CONTRACTS ── */}
      {activeTab === 'contracts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 16, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <p style={{ fontSize: 13, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} />
              Contract value is entered by Sales Executive, validated by Sales Manager, and confirmed by Regional Manager.
            </p>
          </Card>
          {contracts.map(cnt => (
            <Card key={cnt.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{cnt.id}</h3>
                    <Badge variant={cnt.status === 'Active' ? 'success' : 'warm'}>{cnt.status}</Badge>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{cnt.leadName} · {cnt.project} · {cnt.config}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#34D399' }}>₹{cnt.contractValue.toLocaleString()}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{formatDate(cnt.startDate)} → {formatDate(cnt.estimatedCompletion)}</p>
                </div>
              </div>

              {/* Approval Chain */}
              <div style={{ padding: '14px 20px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid var(--border)' }}>
                <ApprovalStep label="Entered by" person={cnt.enteredBy} />
                <ArrowRight size={14} style={{ color: 'var(--border)' }} />
                <ApprovalStep label="Validated by SM" person={cnt.validatedBy} pending={!cnt.validatedBy} />
                <ArrowRight size={14} style={{ color: 'var(--border)' }} />
                <ApprovalStep label="Confirmed by RM" person={cnt.confirmedBy} pending={!cnt.confirmedBy} />
              </div>

              {/* Payment Schedule */}
              <div style={{ padding: '16px 20px' }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Payment Schedule</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {cnt.paymentSchedule.map((ms, i) => (
                    <div key={i} style={{ padding: 12, borderRadius: 'var(--radius-md)', background: ms.status === 'Paid' ? 'rgba(52,211,153,0.06)' : 'var(--bg-main)', border: `1px solid ${ms.status === 'Paid' ? 'rgba(52,211,153,0.2)' : 'var(--border)'}` }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: ms.status === 'Paid' ? '#34D399' : 'var(--text-dim)', marginBottom: 6 }}>{ms.milestone}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>₹{ms.amount.toLocaleString()}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>Due: {formatDate(ms.dueDate)}</p>
                      <Badge variant={ms.status === 'Paid' ? 'success' : 'gray'} style={{ fontSize: 9, marginTop: 6 }}>{ms.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setShowPaymentModal(false)}>
          <Card style={{ width: 480, padding: 24, animation: 'fadeIn 0.2s' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}><XCircle size={18} /></button>
            </div>
            <div style={{ padding: 12, background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248,113,113,0.2)', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#F87171' }}>⚠ Do NOT share any receipt with customer. Receipts are provided by Account team only.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ModalField label="Customer Name" value={payForm.leadName} onChange={v => setPayForm(f => ({ ...f, leadName: v }))} placeholder="Lead name" />
              <ModalField label="Amount (₹L)" value={payForm.amount} onChange={v => setPayForm(f => ({ ...f, amount: v }))} placeholder="e.g. 4.94" type="number" />
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Payment Mode</label>
                <select value={payForm.mode} onChange={e => setPayForm(f => ({ ...f, mode: e.target.value }))} style={inputStyle}>
                  {['Bank Transfer', 'Cheque', 'UPI', 'Cash', 'Demand Draft'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <ModalField label="PAN Number *" value={payForm.pan} onChange={v => setPayForm(f => ({ ...f, pan: v.toUpperCase() }))} placeholder="ABCPK1234L" />
              <ModalField label="Remarks" value={payForm.remarks} onChange={v => setPayForm(f => ({ ...f, remarks: v }))} placeholder="30% advance collected..." />
              <Button variant="primary" onClick={handleCollectPayment} style={{ marginTop: 8 }}>
                <CreditCard size={16} style={{ marginRight: 6 }} /> Record Payment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

/* ── HELPERS ── */
const inputStyle = { width: '100%', padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13, outline: 'none' };

const ModalField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
  </div>
);

const ApprovalStep = ({ label, person, pending }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: pending ? 'var(--bg-card)' : 'rgba(52,211,153,0.12)', border: `1px solid ${pending ? 'var(--border)' : 'rgba(52,211,153,0.3)'}` }}>
      {pending ? <Clock size={10} style={{ color: 'var(--text-dim)' }} /> : <CheckCircle size={10} style={{ color: '#34D399' }} />}
    </div>
    <div>
      <p style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: 11, fontWeight: 600, color: pending ? 'var(--text-dim)' : 'white' }}>
        {pending ? 'Pending' : `${person.name} (${person.role})`}
      </p>
      {!pending && person?.date && <p style={{ fontSize: 9, color: 'var(--text-dim)' }}>{new Date(person.date).toLocaleDateString()}</p>}
    </div>
  </div>
);

const EstStatusBadge = ({ status }) => {
  const map = {
    'Draft': 'gray', 'Pending Verification': 'warm', 'Verified': 'nurture',
    'Authorized': 'success', 'Shared with Customer': 'success', 'Revised': 'hot',
    'Sent to Customer': 'success', 'Customer Accepted': 'success',
    'Customer Rejected': 'hot', 'Expired': 'gray',
  };
  return <Badge variant={map[status] || 'gray'}>{status}</Badge>;
};

const PayStatusBadge = ({ status }) => {
  const map = { 'Pending': 'warm', 'Collected': 'nurture', 'Receipt Uploaded': 'success', 'Verified by Accounts': 'success' };
  return <Badge variant={map[status] || 'gray'}>{status}</Badge>;
};

const QMini = ({ label, value }) => (
  <div>
    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</span>
    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{value}</p>
  </div>
);

export default SalesProcess;
