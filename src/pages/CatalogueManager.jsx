import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../components/ui/index.jsx';
import { BookOpen, Upload, Send, Download, Trash2, Plus, Mail, MessageSquare, Eye, FileText, CheckCircle } from 'lucide-react';
import { catalogues as initialCatalogues } from '../data/mockData.js';

const CatalogueManager = () => {
  const [catalogues, setCatalogues] = useState(initialCatalogues);
  const [showUpload, setShowUpload] = useState(false);
  const [sendModal, setSendModal] = useState(null);
  const [sendTo, setSendTo] = useState('');
  const [sendChannel, setSendChannel] = useState('WhatsApp');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = () => {
    setSentSuccess(true);
    setTimeout(() => { setSentSuccess(false); setSendModal(null); setSendTo(''); }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>Catalogue & Brochures</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Upload and send catalogues via WhatsApp and Email.</p>
        </div>
        <Button variant="primary" onClick={() => setShowUpload(!showUpload)}>
          <Upload size={16} style={{ marginRight: 6 }} /> Upload New
        </Button>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <Card style={{ padding: 24, border: '1px solid rgba(168,137,68,0.3)', background: 'linear-gradient(to right, rgba(168,137,68,0.03), rgba(0,0,0,0))', animation: 'fadeIn 0.3s' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16 }}>Upload New Catalogue</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Document Name</label>
              <input placeholder="e.g. Kitchen Designs 2026" style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13, transition: 'all 0.2s', outline: 'none' }} onFocus={e => e.currentTarget.style.border = '1px solid var(--primary)'} onBlur={e => e.currentTarget.style.border = '1px solid var(--border)'} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Type</label>
              <select style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13, transition: 'all 0.2s', outline: 'none' }} onFocus={e => e.currentTarget.style.border = '1px solid var(--primary)'} onBlur={e => e.currentTarget.style.border = '1px solid var(--border)'}>
                <option>Brochure</option>
                <option>Catalogue</option>
                <option>Price List</option>
                <option>Design Portfolio</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Channels</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['WhatsApp', 'Email'].map(ch => (
                <button key={ch} style={{ padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 500, background: 'rgba(168,137,68,0.1)', border: '1px solid rgba(168,137,68,0.3)', color: 'var(--primary-light)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,137,68,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,137,68,0.1)'}>{ch}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: 32, border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(168,137,68,0.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)'; }}
            onClick={() => { setCatalogues(prev => [{ id: Date.now(), name: 'New Catalogue Upload', type: 'Brochure', format: 'PDF', size: '2.1 MB', uploadedBy: 'Current User', uploadDate: new Date().toISOString().split('T')[0], channels: ['WhatsApp', 'Email'], url: '#' }, ...prev]); setShowUpload(false); }}>
            <Upload size={28} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Click to upload PDF, PNG, or JPEG</p>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Maximum file size: 15MB</p>
          </div>
        </Card>
      )}

      {/* Catalogue Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {catalogues.map(cat => (
          <Card key={cat.id} style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,137,68,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            {/* Preview Header */}
            <div style={{ height: 160, background: 'radial-gradient(circle at top right, rgba(168,137,68,0.15) 0%, rgba(20,24,32,1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <FileText size={56} style={{ color: 'var(--primary)', opacity: 0.3 }} />
              <Badge variant="outline" style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>{cat.format}</Badge>
            </div>
            <div style={{ padding: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 4 }}>{cat.name}</h4>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 12 }}>
                {cat.type} · {cat.size} · Uploaded {cat.uploadDate}
              </p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {cat.channels.map(ch => (
                  <Badge key={ch} variant={ch === 'WhatsApp' ? 'success' : 'nurture'} style={{ fontSize: 9 }}>
                    {ch === 'WhatsApp' ? <MessageSquare size={10} style={{ marginRight: 3 }} /> : <Mail size={10} style={{ marginRight: 3 }} />}
                    {ch}
                  </Badge>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => setSendModal(cat)}>
                  <Send size={13} style={{ marginRight: 4 }} /> Send
                </Button>
                <Button variant="outline" size="sm"><Download size={13} /></Button>
                <Button variant="ghost" size="sm" style={{ color: '#F87171' }}><Trash2 size={13} /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Send Modal */}
      {sendModal && (
        <Modal onClose={() => setSendModal(null)}>
          {sentSuccess ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <CheckCircle size={48} style={{ color: '#34D399', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>Sent Successfully!</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>"{sendModal.name}" has been sent via {sendChannel}.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>Send "{sendModal.name}"</h3>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 20 }}>Send this catalogue to a lead via WhatsApp or Email.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Recipient (Phone / Email)</label>
                  <input value={sendTo} onChange={e => setSendTo(e.target.value)} placeholder="+91 98860 12345 or email@example.com" style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13, transition: 'all 0.2s', outline: 'none' }} onFocus={e => e.currentTarget.style.border = '1px solid var(--primary)'} onBlur={e => e.currentTarget.style.border = '1px solid var(--border)'} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Channel</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {sendModal.channels.map(ch => (
                      <button key={ch} onClick={() => setSendChannel(ch)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, background: sendChannel === ch ? 'var(--primary-bg)' : 'rgba(255,255,255,0.02)', border: `1px solid ${sendChannel === ch ? 'var(--primary)' : 'var(--border)'}`, color: sendChannel === ch ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { if (sendChannel !== ch) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={e => { if (sendChannel !== ch) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                        {ch === 'WhatsApp' ? <MessageSquare size={14} /> : <Mail size={14} />}
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setSendModal(null)}>Cancel</Button>
                <Button variant="primary" onClick={handleSend}>
                  <Send size={14} style={{ marginRight: 6 }} /> Send Now
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CatalogueManager;
