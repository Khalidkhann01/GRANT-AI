import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaUser, FaLock, FaFileAlt, FaBolt, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginLogic = async (targetUser, targetPass) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { username: targetUser, password: targetPass });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Welcome back, Admin!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Invalid credentials. Use admin / 1234');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginLogic(username, password);
  };

  // ⚡ Recruiter Fast-Track Bypass handler
  const handleRecruiterBypass = () => {
    setUsername('admin');
    setPassword('1234');
    handleLoginLogic('admin', '1234');
  };

  return (
    <div style={styles.container}>
      {/* Background Visual Grid & Mesh Flashes */}
      <div style={styles.background}>
        <div style={styles.radialGlow}></div>
      </div>
      
      <div style={styles.card}>
        {/* Branding Title */}
        <div style={styles.logoContainer}>
          <div style={styles.iconCircle}>
            <FaFileAlt size={24} color="#10b981" />
          </div>
          <h1 style={styles.title}>GrantAI <span style={styles.titleSuffix}>Core</span></h1>
          <p style={styles.subtitle}>Secure Access Node</p>
        </div>

        {/* ⚡ Recruiter Instant Entry Button */}
        <button 
          type="button" 
          onClick={handleRecruiterBypass} 
          style={styles.recruiterBtn}
          disabled={loading}
        >
          <div style={styles.recruiterBtnContent}>
            <FaBolt style={{ color: '#06b6d4', fontSize: '18px' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={styles.recruiterBtnTitle}>Recruiter Fast-Track</div>
              <div style={styles.recruiterBtnSub}>Auto-fill & launch workspace</div>
            </div>
          </div>
          <FaArrowRight size={14} color="#94a3b8" />
        </button>

        <div style={styles.dividerZone}>
          <div style={styles.line}></div>
          <span style={styles.dividerText}>OR SIGN IN MANUALLY</span>
          <div style={styles.line}></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Verifying Node Connection...' : 'Authenticate Environment'}
          </button>

          <p style={styles.hint}>Default System Credentials: <code style={styles.code}>admin / 1234</code></p>
        </form>

        <div style={styles.footer}>
          <span>Pipeline Status: Active</span>
          <span>•</span>
          <span>v2.0 Architecture</span>
        </div>
      </div>
    </div>
  );
};

// --- Premium Architectural Styles Mapping ---
const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0f1d', 
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    margin: 0,
    padding: 0,
  },
  background: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  radialGlow: {
    position: 'absolute',
    width: '700px',
    height: '700px',
    background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, rgba(16,185,129,0.04) 50%, rgba(0,0,0,0) 100%)',
    borderRadius: '50%',
  },
  card: {
    background: '#131b2e',
    border: '1px solid #1e293b',
    borderRadius: '24px',
    padding: '44px 40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
    position: 'relative',
    zIndex: 10,
    boxSizing: 'border-box',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  iconCircle: {
    width: '54px',
    height: '54px',
    backgroundColor: 'rgba(16, 185, 121, 0.08)',
    border: '1px solid rgba(16, 185, 121, 0.2)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 18px',
  },
  title: {
    fontSize: '28px', 
    fontWeight: 800,
    color: '#f8fafc',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
  },
  titleSuffix: {
    background: 'linear-gradient(to right, #06b6d4, #10b981)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  recruiterBtn: {
    width: '100%',
    padding: '14px 18px',
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
    border: '1px solid rgba(6, 182, 212, 0.18)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '28px',
    boxSizing: 'border-box',
  },
  recruiterBtnContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  recruiterBtnTitle: {
    color: '#06b6d4',
    fontSize: '15px',
    fontWeight: 600,
  },
  recruiterBtnSub: {
    color: '#94a3b8',
    fontSize: '12px',
    marginTop: '2px',
  },
  dividerZone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    marginBottom: '28px',
  },
  line: {
    flex: 1,
    height: '1px',
    backgroundColor: '#1e293b',
  },
  dividerText: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', 
  },
  inputGroup: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#1e293b', 
    fontSize: '18px',
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 48px', 
    borderRadius: '12px',
    border: '1px solid #1e293b',
    fontSize: '15px',
    outline: 'none',
    background: '#ffffff', 
    color: '#000000', 
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  button: {
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: '#10b981',
    color: '#000000', 
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8px',
    transition: 'background 0.2s ease',
  },
  hint: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  code: {
    color: '#cbd5e1',
    backgroundColor: '#0a0f1d',
    padding: '3px 8px',
    borderRadius: '6px',
    fontFamily: 'monospace',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #1e293b',
    fontSize: '12px',
    color: '#475569',
  },
};

export default Login;