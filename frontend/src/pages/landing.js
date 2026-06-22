import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-icon">⬢</span> GrantAI Core
        </div>
        <Link to="/dashboard" className="btn-nav-signin">
          Open App Demo
        </Link>
      </nav>

      {/* Hero Header */}
      <header className="landing-hero">
        <span className="badge-n8n">
          <span>⚙️</span> Distributed Node Agent Pipeline Active
        </span>
        <h1 className="hero-title">
          Autonomous AI Agent For <br />
          <span className="hero-gradient-text">Enterprise Grant Proposals</span>
        </h1>
        <p className="hero-description">
          A full-stack application connecting a responsive React client to a robust Express REST API, orchestration engine, and multi-agent n8n routing architectures.
        </p>
        <div className="cta-group">
          <Link to="/dashboard" className="btn-hero-cta">
            Launch Live Dashboard
          </Link>
        </div>
      </header>

      {/* SECTION 1: n8n Workflow Visualization */}
      <section className="architecture-section">
        <h3 className="section-headline">n8n Agent Orchestration Pipeline</h3>
        
        <div className="workflow-card">
          <div className="workflow-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Visual Workflow Architecture</h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Multi-agent routing, parallel processing & automated delivery
              </p>
            </div>
            <div className="status-indicator">
              <span className="status-dot"></span>
              Live & Operational
            </div>
          </div>

          {/* Workflow Image */}
          <div className="workflow-image-container">
            <img 
              src="/workflow.png" 
              alt="n8n Grant Proposal Workflow Architecture" 
              className="workflow-image"
            />
            <div className="workflow-image-overlay">
              <div className="overlay-badge">
                <span className="pulse-dot"></span>
                12 Active Nodes
              </div>
            </div>
          </div>

          <div className="workflow-stats">
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">AI Agents</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Parallel Threads</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Output Integrations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Automated</span>
            </div>
          </div>

          <div className="integrations-bar">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Broadcast Integrations:
            </span>
            <div className="integration-item"><span style={{ color: '#ea4335' }}>✉️</span> Gmail API Service</div>
            <div className="integration-item"><span style={{ color: '#24a1de' }}>✈️</span> Telegram Bot API</div>
            <div className="integration-item"><span style={{ color: 'var(--accent-cyan)' }}>🌐</span> Live Webhooks & Core DB</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Orchestration Flow */}
      <section className="architecture-section">
        <h3 className="section-headline">Orchestration Flow</h3>
        
        <div className="pipeline-grid">
          <div className="pipeline-card">
            <span className="pipeline-step">Step 01 // Ingest</span>
            <h4>Payload Normalization</h4>
            <p>Receives system client parameters, sanitizes incoming structural fields, and safely initializes DB states.</p>
          </div>

          <div className="pipeline-card">
            <span className="pipeline-step">Step 02 // Analysis</span>
            <h4>Parallel Groq LLM Array</h4>
            <p>Triggers asynchronous parallel context threads evaluation: Project Analyzer, Grant Scorer, and Donor Matcher.</p>
          </div>

          <div className="pipeline-card">
            <span className="pipeline-step">Step 03 // Synthesis</span>
            <h4>Context-Aware Writing</h4>
            <p>Flattens multi-node assessment responses into specialized Proposal Writer and Executive Summarizer agents.</p>
          </div>

          <div className="pipeline-card">
            <span className="pipeline-step">Step 04 // Compilation</span>
            <h4>Binary PDF Compilation</h4>
            <p>Renders raw generation blocks into styled HTML-to-PDF objects, mapping data structures back to base controllers.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Deep-Dive Node.js API Capabilities */}
      <section className="architecture-section">
        <h3 className="section-headline">Robust REST API Implementation</h3>
        
        <div className="tech-breakdown-grid">
          <div className="tech-card">
            <span className="tech-tag">Asynchronous Patterns</span>
            <h4>Dual-Mode Lifecycle Management</h4>
            <p>
              Features intelligent orchestration. If n8n provides an immediate response, the API processes it on the fly. If processing takes longer, the endpoint shifts smoothly into an asynchronous state—marking the entry as <code>"processing"</code> and letting incoming event-driven webhooks handle state completion later.
            </p>
          </div>

          <div className="tech-card">
            <span className="tech-tag">Buffer Management</span>
            <h4>Multi-Format Binary Stream Storage</h4>
            <p>
              Engineered webhooks to accept multiple inbound content states. Safely transforms incoming raw Base64 document strings, multi-node buffers, or complex nested stream objects straight into a binary MongoDB <code>Buffer</code> allocation storage schema.
            </p>
          </div>

          <div className="tech-card">
            <span className="tech-tag">Data Encapsulation</span>
            <h4>Deterministic Output Sanitization</h4>
            <p>
              Protects infrastructure pipelines by implementing clean mapping serialization. Strip-filters complex unmapped binary components (like heavy document storage fields) prior to API response dispatch, minimizing transport payload overhead.
            </p>
          </div>

          <div className="tech-card">
            <span className="tech-tag">Granular Content Mapping</span>
            <h4>Deep Analytical Metadata Mapping</h4>
            <p>
              Stores complex structural parameters inside a single MongoDB tracking schema. Dynamically binds donor matches, fundability grades, project risk indicators, and customized recommendations directly to the proposal timeline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
//add landing page