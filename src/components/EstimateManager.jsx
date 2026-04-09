import React, { useState } from 'react';
import { Card, Button } from './ui';
import { Plus, Edit2, Eye, Download, FileText, ChevronLeft, Trash2 } from 'lucide-react';
import EstimateBuilder from './EstimateBuilder';
import EstimatePreview from './EstimatePreview';

const EstimateManager = ({ lead, updateLead }) => {
  const [estimates, setEstimates] = useState(lead?.estimates || []);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'build', 'preview'
  const [activeEstimate, setActiveEstimate] = useState(null);

  const handleCreate = () => {
    setActiveEstimate({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      rooms: [],
      discounts: [{ id: Date.now().toString(), name: 'EL Discount', amount: 0 }],
      grandTotal: 0
    });
    setCurrentView('build');
  };

  const handleSave = (est) => {
    let newEstimates;
    if (estimates.find(e => e.id === est.id)) {
      newEstimates = estimates.map(e => e.id === est.id ? est : e);
    } else {
      newEstimates = [...estimates, est];
    }
    setEstimates(newEstimates);
    if (updateLead && lead) updateLead(lead.id, { estimates: newEstimates });
    setCurrentView('list');
  };

  const handleDelete = (id) => {
    const newEstimates = estimates.filter(e => e.id !== id);
    setEstimates(newEstimates);
    if (updateLead && lead) updateLead(lead.id, { estimates: newEstimates });
  };

  if (currentView === 'build') {
    return (
      <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button variant="ghost" onClick={() => setCurrentView('list')} style={{ paddingLeft: 0 }}>
            <ChevronLeft size={16} style={{ marginRight: 4 }}/> Back to Estimates
          </Button>
        </div>
        <EstimateBuilder initialData={activeEstimate} onSave={handleSave} onCancel={() => setCurrentView('list')} />
      </div>
    );
  }

  const handlePrint = () => {
    const printContent = document.getElementById('printable-estimate')?.innerHTML;
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(s => s.outerHTML).join('');

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>Quotation - ${lead?.name || 'Morph'}</title>
          ${styles}
          <style>
            @page { margin: 15mm; size: A4 portrait; }
            body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
            #printable-content > div { min-height: auto !important; max-width: 100% !important; min-width: 100% !important; width: 100% !important; margin: 0 auto !important; box-shadow: none !important; }
          </style>
        </head>
        <body>
          <div id="printable-content">${printContent}</div>
        </body>
      </html>
    `);
    iframeDoc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };

  if (currentView === 'preview') {
    return (
      <div className="animate-fade-in print-preview-container" style={{ overflowX: 'auto', paddingBottom: 40, width: '100%' }}>
        <div className="print:hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, background: 'var(--bg-card)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <Button variant="ghost" onClick={() => setCurrentView('list')} style={{ paddingLeft: 0 }}>
            <ChevronLeft size={16} style={{ marginRight: 4 }}/> Back
          </Button>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" onClick={() => { setActiveEstimate(activeEstimate); setCurrentView('build'); }}>
              <Edit2 size={14} style={{ marginRight: 6 }}/> Edit
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              <Download size={14} style={{ marginRight: 6 }}/> Download PDF
            </Button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 20px' }}>
          <div id="printable-estimate" style={{ width: '100%', maxWidth: '210mm' }}>
            <EstimatePreview estimate={activeEstimate} lead={lead} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={18} style={{ color: 'var(--primary)' }}/> Lead Estimates
        </h3>
        <Button variant="primary" onClick={handleCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Create Estimate
        </Button>
      </div>

      {estimates.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center', borderStyle: 'dashed' }}>
          <FileText size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
          <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>No estimates yet</h4>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Create an estimate to share quotations with the client.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {estimates.map(est => (
            <Card key={est.id} style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Estimate #{est.id.slice(-4)}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{new Date(est.date).toLocaleDateString()} · ₹{(est.grandTotal || 0).toLocaleString()}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" size="sm" onClick={() => { setActiveEstimate(est); setCurrentView('preview'); }}>
                  <Eye size={14} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setActiveEstimate(est); setCurrentView('build'); }}>
                  <Edit2 size={14} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(est.id)} style={{ color: '#F87171', borderColor: 'rgba(248,113,113,0.3)' }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EstimateManager;
