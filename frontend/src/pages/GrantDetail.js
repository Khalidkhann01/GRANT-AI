import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  FaArrowLeft, FaDownload, FaCheckCircle, 
  FaClock, FaDollarSign, FaBuilding, FaGlobe, FaCalendar,
  FaFilePdf, FaEye, FaSpinner, FaChartBar, FaLightbulb,
  FaHandshake, FaBullseye, FaRocket,
  FaStar, FaStarHalfAlt, FaRegStar
} from 'react-icons/fa';
import { format } from 'date-fns';
import styles from './GrantDetail.module.css';

// API Base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

const GrantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grant, setGrant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadGrant = useCallback(async () => {
    try {
      // ✅ Using api.get() - baseURL is already set
      const res = await api.get(`/grants/${id}`);
      if (res.data.success) {
        console.log('✅ Grant data loaded:', {
          hasPdfData: !!res.data.grant.pdfData,
          hasHtmlProposal: !!res.data.grant.htmlProposal,
          status: res.data.grant.status,
          score: res.data.grant.score
        });
        setGrant(res.data.grant);
      } else {
        toast.error('Grant not found');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error loading grant:', err);
      toast.error('Failed to load grant');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadGrant();
  }, [loadGrant]);

  const handleViewPDF = () => {
    if (!grant?.pdfData && !grant?.htmlProposal) {
      toast.error('No PDF or proposal content available');
      return;
    }
    
    const pdfUrl = `${API_BASE_URL}/grants/${id}/pdf`;
    setPdfLoading(true);
    
    axios.get(pdfUrl, { 
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((response) => {
        if (response.data.type === 'application/pdf') {
          const url = URL.createObjectURL(response.data);
          window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 60000);
          toast.success('PDF opened successfully');
        } else {
          if (grant?.htmlProposal) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(grant.htmlProposal);
            printWindow.document.close();
            printWindow.focus();
            toast.success('Proposal opened in new window');
          } else {
            toast.error('No PDF or proposal content available');
          }
        }
        setPdfLoading(false);
      })
      .catch((error) => {
        console.error('PDF fetch error:', error);
        if (grant?.htmlProposal) {
          const printWindow = window.open('', '_blank');
          printWindow.document.write(grant.htmlProposal);
          printWindow.document.close();
          printWindow.focus();
          toast.success('Proposal opened in new window');
        } else {
          toast.error('No PDF or proposal content available');
        }
        setPdfLoading(false);
      });
  };

  const handleDownloadPDF = () => {
    if (!grant?.pdfData && !grant?.htmlProposal) {
      toast.error('No PDF or proposal content available');
      return;
    }

    const pdfUrl = `${API_BASE_URL}/grants/${id}/pdf`;
    setPdfLoading(true);
    
    axios.get(pdfUrl, { 
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((response) => {
        if (response.data.type === 'application/pdf') {
          const url = URL.createObjectURL(response.data);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${grant.projectName}_Grant_Proposal.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success('PDF downloaded successfully');
        } else {
          handleDownloadHTML();
        }
        setPdfLoading(false);
      })
      .catch((error) => {
        console.error('Download error:', error);
        handleDownloadHTML();
        setPdfLoading(false);
      });
  };

  const handleDownloadHTML = () => {
    if (!grant?.htmlProposal) {
      toast.error('No proposal content available');
      return;
    }
    const blob = new Blob([grant.htmlProposal], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${grant.projectName}_Grant_Proposal.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Proposal downloaded as HTML');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getScoreStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalf = score % 20 >= 10;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} color="#f59e0b" size={14} />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} color="#f59e0b" size={14} />);
      } else {
        stars.push(<FaRegStar key={i} color="#334155" size={14} />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading grant details...</p>
      </div>
    );
  }

  if (!grant) {
    return <div className={styles.loadingContainer}>Grant not found</div>;
  }

  const isCompleted = grant.status === 'completed';
  const score = grant.score || 0;
  const grade = grant.grade || getScoreGrade(score);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className={styles.headerRight}>
          {isCompleted && (
            <>
              <button 
                className={styles.pdfBtn} 
                onClick={handleViewPDF} 
                disabled={pdfLoading}
              >
                {pdfLoading ? <FaSpinner className={styles.spinner} /> : <FaEye />}
                {pdfLoading ? 'Loading...' : 'View PDF'}
              </button>
              <button 
                className={styles.downloadBtn} 
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
              >
                <FaDownload /> {pdfLoading ? 'Loading...' : 'Download'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Title Section */}
        <div className={styles.titleSection}>
          <div className={styles.titleHeader}>
            <h1 className={styles.title}>{grant.projectName}</h1>
            <div className={styles.statusBadge}>
              {grant.status === 'completed' ? (
                <><FaCheckCircle color="#10b981" /> Completed</>
              ) : (
                <><FaClock color="#f97316" /> Processing</>
              )}
            </div>
          </div>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <FaBuilding size={14} color="#64748b" />
              <span>{grant.organization || 'N/A'}</span>
            </div>
            <div className={styles.metaItem}>
              <FaGlobe size={14} color="#64748b" />
              <span>{grant.location || 'N/A'}</span>
            </div>
            <div className={styles.metaItem}>
              <FaCalendar size={14} color="#64748b" />
              <span>{format(new Date(grant.createdAt), 'PPP')}</span>
            </div>
            <div className={styles.metaItem}>
              <FaDollarSign size={14} color="#64748b" />
              <span>${Number(grant.budget || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className={styles.statusSection}>
          <div className={styles.statusCard}>
            <div className={styles.statusLabel}>AI Score</div>
            <div className={styles.statusValue} style={{ color: getScoreColor(score) }}>
              {score}/100
            </div>
            <div className={styles.statusSub}>
              {getScoreStars(score)}
            </div>
          </div>
          <div className={styles.statusCard}>
            <div className={styles.statusLabel}>Grade</div>
            <div className={styles.statusValue} style={{ color: getScoreColor(score) }}>
              {grade}
            </div>
            <div className={styles.statusSub}>Performance Grade</div>
          </div>
          <div className={styles.statusCard}>
            <div className={styles.statusLabel}>Fundability</div>
            <div className={styles.statusValue} style={{ color: grant.fundability === 'High' ? '#10b981' : '#f97316' }}>
              {grant.fundability || 'Medium'}
            </div>
            <div className={styles.statusSub}>Funding Potential</div>
          </div>
          <div className={styles.statusCard}>
            <div className={styles.statusLabel}>Risk Level</div>
            <div className={styles.statusValue} style={{ color: grant.risk_level === 'Low' ? '#10b981' : grant.risk_level === 'Medium' ? '#f97316' : '#ef4444' }}>
              {grant.risk_level || 'Medium'}
            </div>
            <div className={styles.statusSub}>Implementation Risk</div>
          </div>
        </div>

        {/* Score Breakdown */}
        {isCompleted && grant.score_breakdown && Object.keys(grant.score_breakdown).length > 0 && (
          <div className={styles.breakdownSection}>
            <div className={styles.sectionHeader}>
              <FaChartBar size={18} color="#06b6d4" />
              <h3 className={styles.sectionTitle}>Score Breakdown</h3>
            </div>
            <div className={styles.breakdownGrid}>
              {Object.entries(grant.score_breakdown).map(([key, value]) => (
                <div key={key} className={styles.breakdownItem}>
                  <span className={styles.breakdownLabel}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <div className={styles.breakdownBarWrapper}>
                    <div 
                      className={styles.breakdownBar} 
                      style={{
                        width: `${value}%`,
                        background: value >= 80 ? '#10b981' : value >= 60 ? '#f97316' : '#ef4444'
                      }} 
                    />
                  </div>
                  <span className={styles.breakdownValue}>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {isCompleted && grant.recommendations && grant.recommendations.length > 0 && (
          <div className={styles.recSection}>
            <div className={styles.sectionHeader}>
              <FaLightbulb size={18} color="#f59e0b" />
              <h3 className={styles.sectionTitle}>Key Recommendations</h3>
            </div>
            <ul className={styles.recList}>
              {grant.recommendations.map((rec, i) => (
                <li key={i} className={styles.recItem}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Donor Matches */}
        {isCompleted && grant.donor_matches && grant.donor_matches.length > 0 && (
          <div className={styles.donorSection}>
            <div className={styles.sectionHeader}>
              <FaHandshake size={18} color="#10b981" />
              <h3 className={styles.sectionTitle}>Recommended Donors</h3>
            </div>
            {grant.donor_matches.map((donor, i) => (
              <div key={i} className={`${styles.donorCard} ${i === 0 ? styles.donorCardTop : ''}`}>
                <div className={styles.donorHeader}>
                  <span className={styles.donorName}>{i+1}. {donor.name}</span>
                  <span className={styles.donorMatch}>
                    {donor.fit_score}% Match
                  </span>
                </div>
                <div className={styles.donorReason}>{donor.reason}</div>
                <div className={styles.donorDetails}>
                  <span><FaDollarSign size={12} color="#64748b" /> <strong>Range:</strong> {donor.typical_grant_range}</span>
                  <span><FaBullseye size={12} color="#64748b" /> <strong>Success:</strong> {donor.probability_of_success}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Proposal Section */}
        {isCompleted && (grant.htmlProposal || grant.pdfData) ? (
          <div className={styles.proposalSection}>
            <div className={styles.sectionHeader}>
              <FaFilePdf size={18} color="#ef4444" />
              <h3 className={styles.sectionTitle}>Full Grant Proposal</h3>
            </div>
            <div className={styles.proposalActions}>
              <button className={styles.viewProposalBtn} onClick={handleViewPDF}>
                <FaEye /> View PDF
              </button>
              <button className={styles.downloadProposalBtn} onClick={handleDownloadPDF}>
                <FaDownload /> Download PDF
              </button>
            </div>
            <div className={styles.proposalPlaceholder}>
              <div className={styles.proposalIcon}>
                <FaFilePdf size={48} color="#ef4444" />
              </div>
              <h4>Proposal Ready</h4>
              <p>Click <strong>"View PDF"</strong> to open the complete grant proposal, or <strong>"Download PDF"</strong> to save it.</p>
              <div className={styles.proposalStats}>
                <span>📄 {grant.htmlProposal?.length || 0} characters</span>
                <span>📊 Score: {score}/100</span>
                <span>🏆 Grade: {grade}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.processingMsg}>
            <FaRocket size={48} color="#06b6d4" />
            <h3>Proposal is Being Generated</h3>
            <p>Our AI is crafting a comprehensive grant proposal. This usually takes 2-3 minutes.</p>
            <div className={styles.processingLoader}>
              <div className={styles.processingBar} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantDetail;