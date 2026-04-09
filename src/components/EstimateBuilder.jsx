import React, { useState, useEffect } from 'react';
import { Card, Button } from './ui';
import { Plus, Trash2, Save, IndianRupee } from 'lucide-react';

const defaultRooms = ['Kitchen & Utility', 'Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Bedroom 4', 'Washrooms', 'Foyer / Living / Dining', 'Services'];

const EstimateBuilder = ({ initialData, onSave, onCancel }) => {
  const [estimate, setEstimate] = useState(initialData || { date: new Date().toISOString().split('T')[0], rooms: [], discount: 0, subTotal: 0, grandTotal: 0 });

  const calculateTotals = (rooms, discounts) => {
    let subTotal = 0;
    rooms.forEach(r => {
      if (r.isLumpsum) {
        subTotal += (Number(r.lumpsumAmount) || 0);
      } else {
        r.items.forEach(i => {
          subTotal += (Number(i.amount) || 0);
        });
      }
    });

    let totalDiscount = 0;
    if (discounts && discounts.length > 0) {
      totalDiscount = discounts.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    } else {
      totalDiscount = Number(estimate.discount) || 0; // fallback
    }

    return { subTotal, grandTotal: subTotal - totalDiscount };
  };

  useEffect(() => {
    const { subTotal, grandTotal } = calculateTotals(estimate.rooms, estimate.discounts);
    if (grandTotal !== estimate.grandTotal || subTotal !== estimate.subTotal) {
      setEstimate(prev => ({ ...prev, subTotal, grandTotal }));
    }
  }, [estimate.rooms, estimate.discounts, estimate.discount]);

  const addRoom = (name = 'New Room') => {
    setEstimate(prev => ({
      ...prev,
      rooms: [...prev.rooms, { id: Date.now().toString() + Math.random().toString(), name, isLumpsum: false, lumpsumAmount: 0, items: [] }]
    }));
  };

  const removeRoom = (roomId) => {
    setEstimate(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== roomId) }));
  };

  const updateRoomName = (roomId, name) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, name } : r)
    }));
  };

  const toggleLumpsum = (roomId) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, isLumpsum: !r.isLumpsum } : r)
    }));
  };

  const updateRoomLumpsum = (roomId, val) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, lumpsumAmount: val } : r)
    }));
  };

  const addDiscount = () => {
    setEstimate(prev => {
      const discounts = prev.discounts || [{ id: Date.now().toString() + '1', name: 'Discount', amount: prev.discount || 0 }];
      return { ...prev, discounts: [...discounts, { id: Date.now().toString(), name: 'New Discount', amount: 0 }] };
    });
  };

  const removeDiscount = (id) => {
    setEstimate(prev => ({ ...prev, discounts: prev.discounts.filter(d => d.id !== id) }));
  };

  const updateDiscount = (id, field, value) => {
    setEstimate(prev => ({
      ...prev,
      discounts: prev.discounts.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  const addItemToRoom = (roomId) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            items: [...r.items, { id: Date.now().toString() + Math.random().toString(), section: 'Woodwork', product: '', material: '', amount: 0 }]
          };
        }
        return r;
      })
    }));
  };

  const removeItem = (roomId, itemId) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => {
        if (r.id === roomId) {
          return { ...r, items: r.items.filter(i => i.id !== itemId) };
        }
        return r;
      })
    }));
  };

  const updateItem = (roomId, itemId, field, value) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            items: r.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
          };
        }
        return r;
      })
    }));
  };

  const handleSave = () => {
    onSave(estimate);
  };

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-main)',
    border: '1px solid var(--border)',
    color: 'var(--text-main)',
    fontSize: 13,
    width: '100%'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <datalist id="section-options">
        <option value="Woodwork" />
        <option value="Accessories" />
        <option value="Hardware" />
        <option value="Base Units" />
        <option value="Wall Units" />
        <option value="Tall Units" />
        <option value="False Ceiling" />
        <option value="Electrical" />
        <option value="Plumbing" />
        <option value="Painting" />
        <option value="Countertop" />
        <option value="Appliances" />
      </datalist>

      {/* Rooms list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {estimate.rooms.length === 0 && (
          <div style={{ padding: 30, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
            Start building your estimate by adding rooms below.
          </div>
        )}
        {estimate.rooms.map((room, rIndex) => (
          <Card key={room.id} style={{ padding: 20, borderTop: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <input 
                value={room.name} 
                onChange={(e) => updateRoomName(room.id, e.target.value)}
                style={{ ...inputStyle, fontSize: 16, fontWeight: 700, border: 'none', background: 'transparent', padding: 0 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-dim)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={room.isLumpsum || false} onChange={() => toggleLumpsum(room.id)} style={{ accentColor: 'var(--primary)' }}/>
                  Clubbed Pricing
                </label>
                {room.isLumpsum && (
                  <div style={{ position: 'relative', width: 140 }}>
                    <IndianRupee size={12} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }}/>
                    <input type="number" placeholder="Room Total" value={room.lumpsumAmount || ''} onChange={(e) => updateRoomLumpsum(room.id, Number(e.target.value))} style={{ ...inputStyle, paddingLeft: 26, padding: '6px 12px 6px 26px', height: 32 }} />
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={() => removeRoom(room.id)} style={{ color: '#F87171' }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {room.items.map((item, iIndex) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) 2fr 3fr 120px 40px', gap: 10, alignItems: 'start' }}>
                  <input list="section-options" placeholder="Section" value={item.section} onChange={(e) => updateItem(room.id, item.id, 'section', e.target.value)} style={inputStyle} />
                  <input placeholder="Product Summary" value={item.product} onChange={(e) => updateItem(room.id, item.id, 'product', e.target.value)} style={inputStyle} />
                  <textarea rows={2} placeholder="Material Description" value={item.material} onChange={(e) => updateItem(room.id, item.id, 'material', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  {!room.isLumpsum ? (
                    <div style={{ position: 'relative' }}>
                      <IndianRupee size={12} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-muted)' }}/>
                      <input type="number" value={item.amount} onChange={(e) => updateItem(room.id, item.id, 'amount', Number(e.target.value))} style={{ ...inputStyle, paddingLeft: 26 }} />
                    </div>
                  ) : <div />}
                  <Button variant="ghost" size="sm" onClick={() => removeItem(room.id, item.id)} style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={() => addItemToRoom(room.id)} style={{ marginTop: 12 }}>
              <Plus size={14} style={{ marginRight: 6 }}/> Add Line Item
            </Button>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <select onChange={(e) => { if(e.target.value) { addRoom(e.target.value); e.target.value = ''; } }} style={{ ...inputStyle, width: '200px' }}>
          <option value="">+ Quick Add Room</option>
          {defaultRooms.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <Button variant="outline" onClick={() => addRoom()}><Plus size={14} style={{ marginRight: 6 }}/> Add Custom Room</Button>
      </div>

      {/* Summary totals */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: 300 }}>
          <span style={{ color: 'var(--text-dim)' }}>Sub Total</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{(estimate.subTotal || 0).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400, alignItems: 'flex-end' }}>
          {(estimate.discounts || [{ id: 'legacy', name: 'Discount (EL)', amount: estimate.discount || 0 }]).map((disc, idx) => (
            <div key={disc.id || idx} style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center', gap: 10 }}>
              <Button variant="ghost" size="sm" onClick={() => removeDiscount(disc.id)} style={{ color: '#F87171', padding: '0 4px', height: 28 }}>
                <Trash2 size={14} />
              </Button>
              <input value={disc.name} onChange={(e) => updateDiscount(disc.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 1, padding: '4px 8px', maxWidth: 150 }} placeholder="Discount Name" />
              <div style={{ position: 'relative', width: 120 }}>
                <IndianRupee size={12} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }}/>
                <input type="number" value={disc.amount} onChange={(e) => updateDiscount(disc.id, 'amount', Number(e.target.value))} style={{ ...inputStyle, paddingLeft: 26, padding: '6px 12px' }} />
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addDiscount} style={{ color: 'var(--primary)', marginTop: 4 }}>
            <Plus size={14} style={{ marginRight: 4 }}/> Add Ticket Discount
          </Button>
        </div>
        <div style={{ height: 1, width: 300, background: 'var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: 300, fontSize: 18, color: 'var(--primary)' }}>
          <span style={{ fontWeight: 600 }}>Grand Total</span>
          <span style={{ fontWeight: 800 }}>₹{(estimate.grandTotal || 0).toLocaleString()}</span>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}><Save size={14} style={{ marginRight: 6 }}/> Save Estimate</Button>
      </div>
    </div>
  );
};

export default EstimateBuilder;
