import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Input } from '../components/ui/index.jsx';
import { LogIn, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { regions } from '../data/mockData.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState('Pre-sales Executive');
  const [region, setRegion] = useState('Bangalore East');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const defaultRoute = login(email || 'demo@morph.com', role, region);
    navigate(defaultRoute);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-main)' }}>
      {/* Left Panel */}
      <div style={{
        width: '40%', position: 'relative', background: 'var(--bg-sidebar)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRight: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'linear-gradient(rgba(168,137,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,137,68,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15,
          background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 3rem', zIndex: 1 }}>
          <img src="/morph-logo-white.png" alt="Morph Interiors" style={{
            width: 220, margin: '0 auto 2.5rem', filter: 'drop-shadow(0 0 20px rgba(168,137,68,0.35))',
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>
            CRM & VISUALIZATION
          </h1>
          <p style={{
            color: 'var(--primary-light)', fontSize: 15, fontWeight: 500,
            background: 'rgba(168,137,68,0.1)', border: '1px solid rgba(168,137,68,0.25)',
            padding: '8px 20px', borderRadius: 999, display: 'inline-block',
          }}>
            Premium Presales Platform
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, background: 'var(--bg-card)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', margin: '0 auto 8px',
              }}><Shield size={22} /></div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Secure Access</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, background: 'var(--bg-card)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', margin: '0 auto 8px',
              }}><Users size={22} /></div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Team Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 440 }} className="animate-fade-in">
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 8 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>
            Enter your credentials to access the Morph Presales engine.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email or Employee ID" placeholder="e.g. rahul.v@morph.com" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div style={{ position: 'relative' }}>
              <Input label="Password" type={showPwd ? 'text' : 'password'} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: 34, color: 'var(--text-dim)', padding: 4 }}>
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>Log in as</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'white', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 14 }}>
                  <option value="Pre-sales Executive">Pre-sales Executive</option>
                  <option value="Regional Manager">Regional Manager</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="CRM Head">CRM Head</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>Region</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'white', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 14 }}>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" style={{ fontSize: 13, color: 'var(--primary)' }}>Forgot Password?</button>
            </div>
          </div>

          <Button type="submit" style={{ width: '100%', height: 48, fontSize: 16, marginTop: 24 }}>
            <LogIn size={20} style={{ marginRight: 8 }} />
            Login to Workspace
          </Button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginTop: 24 }}>
            Powered by Morph Interiors Technology 2026
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
