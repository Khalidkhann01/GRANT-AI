import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  FaArrowLeft, FaDownload, FaPrint, FaCheckCircle, 
  FaClock, FaAward, FaDollarSign, FaBuilding, FaGlobe, FaCalendar,
  FaFilePdf, FaEye
} from 'react-icons/fa';
import { format } from 'date-fns';
import styles from './GrantDetail.module.css';

const GrantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grant, setGrant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    loadGrant();
  }, [id]);

  const loadGrant = async () => {
    try {
      const res = await axios.get(`/api/grants/${id}`);
      if (res.data.success) {
        console.log('✅ Grant data loaded:', {
          hasPdfData: !!res.data.grant.pdfData,
          hasHtmlProposal: !!res.data.grant.htmlProposal,
          status: res.data.grant.status,
          score: res.data.grant.score
        });
        setGrant(res.data.grant);
      }
    } catch (err) {
      toast.error('Failed to load grant');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = () => {
    if (!grant?.pdfData && !grant?.htmlProposal) {
      toast.error('No PDF or proposal content available');
      return;
    }
    
    const pdfUrl = `/api/grants/${id}/pdf`;
    setPdfLoading(true);
    
    axios.get(pdfUrl, { responseType: 'blob' })
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
      .catch(() => {
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

    const pdfUrl = `/api/grants/${id}/pdf`;
    setPdfLoading(true);
    
    axios.get(pdfUrl, { responseType: 'blob' })
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
      .catch(() => {
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

  const handlePrint = () => {
    if (!grant?.htmlProposal) {
      toast.error('No proposal content to print');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(grant.htmlProposal);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!grant) {
    return <div className={styles.loading}>Grant not found</div>;
  }

  const isCompleted = grant.status === 'completed';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back
        </button>
        <div className={styles.headerRight}>
          {isCompleted && (
            <>
              <button 
                className={styles.pdfBtn} 
                onClick={handleViewPDF} 
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Loading...' : <><FaEye /> View PDF</>}
              </button>
              <button 
                className={styles.downloadBtn} 
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
              >
                <FaDownload /> {pdfLoading ? 'Loading...' : 'Download'}
              </button>
              <button className={styles.printBtn} onClick={handlePrint}>
                <FaPrint /> Print
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{grant.projectName}</h1>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <FaBuilding size={14} color="#6b7280" />
              <span>{grant.organization || 'N/A'}</span>
            </div>
            <div className={styles.metaItem}>
              <FaGlobe size={14} color="#6b7280" />
              <span>{grant.location || 'N/A'}</span>
            </div>
            <div className={styles.metaItem}>
              <FaCalendar size={14} color="#6b7280" />
              <span>{format(new Date(grant.createdAt), 'PPP')}</span>
            </div>
            <div className={styles.metaItem}>
              <FaDollarSign size={14} color="#6b7280" />
              <span>${Number(grant.budget || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={styles.statusSection}>
          <div className={styles.statusCard}>
            <div className={styles.statusLabel}>Status</div>
            <div className={`${styles.statusValue} ${grant.status === 'completed' ? styles.statusCompleted : styles.statusProcessing}`}>
              {grant.status === 'completed' ? <FaCheckCircle /> : <FaClock />}
              {grant.status}
            </div>
          </div>
          {grant.score && (
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>Score</div>
              <div className={styles.statusValue}>{grant.score}/100</div>
            </div>
          )}
          {grant.grade && (
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>Grade</div>
              <div className={styles.statusValue}>{grant.grade}</div>
            </div>
          )}
          {grant.fundability && (
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>Fundability</div>
              <div className={styles.statusValue}>{grant.fundability}</div>
            </div>
          )}
        </div>

        {isCompleted && grant.score_breakdown && Object.keys(grant.score_breakdown).length > 0 && (
          <div className={styles.breakdownSection}>
            <h3 className={styles.sectionTitle}>Score Breakdown</h3>
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
                        background: value >= 80 ? '#16a34a' : value >= 60 ? '#d97706' : '#dc2626'
                      }} 
                    />
                  </div>
                  <span className={styles.breakdownValue}>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCompleted && grant.donor_matches && grant.donor_matches.length > 0 && (
          <div className={styles.donorSection}>
            <h3 className={styles.sectionTitle}>Recommended Donors</h3>
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
                  <span><strong>Range:</strong> {donor.typical_grant_range}</span>
                  <span><strong>Success:</strong> {donor.probability_of_success}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {isCompleted && grant.recommendations && grant.recommendations.length > 0 && (
          <div className={styles.recSection}>
            <h3 className={styles.sectionTitle}>Recommendations</h3>
            <ul className={styles.recList}>
              {grant.recommendations.map((rec, i) => (
                <li key={i} className={styles.recItem}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {isCompleted && (grant.htmlProposal || grant.pdfData) ? (
          <div className={styles.proposalSection}>
            <h3 className={styles.sectionTitle}>Full Proposal</h3>
            <div className={styles.proposalActions}>
              <button className={styles.viewProposalBtn} onClick={handleViewPDF}>
                <FaFilePdf /> View PDF
              </button>
              <button className={styles.downloadProposalBtn} onClick={handleDownloadPDF}>
                <FaDownload /> Download PDF
              </button>
            </div>
            {grant.htmlProposal && (
              <div 
                className={styles.proposalFrame}
                dangerouslySetInnerHTML={{ __html: grant.htmlProposal }}
              />
            )}
            {!grant.htmlProposal && grant.pdfData && (
              <div className={styles.pdfPlaceholder}>
                <FaFilePdf size={48} color="#dc2626" />
                <p>PDF is available. Click "View PDF" to open it.</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.processingMsg}>
            <FaClock size={48} color="#d97706" />
            <h3>Proposal is being generated</h3>
            <p>This may take a few moments. Please refresh the page later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantDetail;