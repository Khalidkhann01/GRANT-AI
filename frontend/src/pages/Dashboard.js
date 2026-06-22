import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  FaPlus, FaSearch, FaFileAlt, FaTrash, 
  FaClock, FaAward, FaRocket, 
  FaDollarSign, FaCalendarAlt, FaBuilding,
  FaStar, FaStarHalfAlt, FaRegStar,
  FaEnvelope, FaSpinner, FaPaperPlane, 
  FaInfoCircle, FaGift, FaBullseye, FaGlobe, FaCheck,
  FaEye, FaTimes
} from 'react-icons/fa';
import { format, formatDistanceToNow } from 'date-fns';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [grants, setGrants] = useState([]);
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedGrants, setSelectedGrants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [grantToDelete, setGrantToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedEmails, setSubmittedEmails] = useState([]);
  const [submittedProject, setSubmittedProject] = useState('');
  const [lastCreatedGrantId, setLastCreatedGrantId] = useState(null);
  const [newGrant, setNewGrant] = useState({
    projectName: '',
    description: '',
    budget: '',
    goals: '',
    donorType: '',
    organization: '',
    location: '',
    duration: '24 months',
    emails: []
  });
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    totalBudget: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      const res = await axios.get('https://projects-759s.onrender.com/api/grants');
      if (res.data.success) {
        setGrants(res.data.grants);
        setFilteredGrants(res.data.grants);
        const g = res.data.grants;
        const completed = g.filter(x => x.status === 'completed');
        let avgScore = 0;
        if (completed.length > 0) {
          const sum = completed.reduce((acc, x) => acc + (x.score || 0), 0);
          avgScore = Math.round(sum / completed.length);
        }
        const totalBudget = g.reduce((acc, x) => acc + (x.budget || 0), 0);
        setStats({
          total: g.length,
          avgScore: avgScore,
          totalBudget: totalBudget
        });
      }
    } catch (err) {
      toast.error('Failed to load grants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = grants.slice();
    
    if (searchTerm) {
      result = result.filter(g => 
        (g.projectName && g.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.organization && g.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredGrants(result);
  }, [grants, searchTerm]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    if (!emailInput.trim()) {
      setEmailError('Please enter an email address');
      return;
    }
    if (!validateEmail(emailInput.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (newGrant.emails.includes(emailInput.trim())) {
      setEmailError('This email is already added');
      return;
    }
    setNewGrant({ ...newGrant, emails: [...newGrant.emails, emailInput.trim()] });
    setEmailInput('');
    setEmailError('');
  };

  const removeEmail = (emailToRemove) => {
    if (newGrant.emails.length <= 1) {
      toast.error('You need at least one email recipient');
      return;
    }
    setNewGrant({ ...newGrant, emails: newGrant.emails.filter(e => e !== emailToRemove) });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleCreateGrant = async (e) => {
    e.preventDefault();
    
    if (newGrant.emails.length === 0) {
      toast.error('Please add at least one email recipient');
      return;
    }

    setIsSubmitting(true);
    
    const payload = { 
      projectName: newGrant.projectName.trim(),
      description: newGrant.description.trim(),
      budget: Number(newGrant.budget),
      goals: newGrant.goals.trim() || 'Not specified',
      donorType: newGrant.donorType.trim() || 'General',
      organization: newGrant.organization.trim() || 'Not specified',
      location: newGrant.location.trim() || 'Not specified',
      duration: newGrant.duration.trim() || '24 months',
      email: newGrant.emails[0],
      emails: newGrant.emails
    };
    
    try {
      const res = await axios.post('https://projects-759s.onrender.com/api/grants/create', payload);
      if (res.data.success) {
        const grantId = res.data.grant?._id || res.data.grant?.id;
        setLastCreatedGrantId(grantId);
        
        setSubmittedEmails(newGrant.emails);
        setSubmittedProject(newGrant.projectName);
        setShowSuccessModal(true);
        
        setShowModal(false);
        setNewGrant({ 
          projectName: '', description: '', budget: '', goals: '', 
          donorType: '', organization: '', location: '', 
          duration: '24 months', emails: [] 
        });
        setEmailInput('');
        setEmailError('');
        loadGrants();
      }
    } catch (err) {
      console.error('Create error:', err);
      toast.error('Failed to create grant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await axios.delete('/api/grants/' + id);
      toast.success('Grant deleted successfully');
      setGrantToDelete(null);
      setShowDeleteModal(false);
      await loadGrants();
    } catch (err) {
      toast.error('Failed to delete grant');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGrants.length === 0) return;
    
    if (!window.confirm(`⚠️ Are you sure you want to delete ${selectedGrants.length} grant${selectedGrants.length > 1 ? 's' : ''}? This action cannot be undone!`)) {
      return;
    }
    
    setIsBulkDeleting(true);
    try {
      const deletePromises = selectedGrants.map(id => axios.delete('/api/grants/' + id));
      await Promise.all(deletePromises);
      toast.success(`${selectedGrants.length} grants deleted successfully`);
      setSelectedGrants([]);
      setSelectAll(false);
      await loadGrants();
    } catch (err) {
      toast.error('Failed to delete some grants');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleSelect = (id) => {
    if (selectedGrants.includes(id)) {
      setSelectedGrants(selectedGrants.filter(s => s !== id));
    } else {
      setSelectedGrants([...selectedGrants, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedGrants([]);
    } else {
      setSelectedGrants(filteredGrants.map(g => g._id));
    }
    setSelectAll(!selectAll);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const getScoreStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalf = score % 20 >= 10;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} color="#f59e0b" size={12} />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} color="#f59e0b" size={12} />);
      } else {
        stars.push(<FaRegStar key={i} color="#334155" size={12} />);
      }
    }
    return stars;
  };

  const getGrantEmails = (grant) => {
    if (grant.emails && Array.isArray(grant.emails)) {
      return grant.emails;
    }
    if (grant.email) {
      return [grant.email];
    }
    return ['No email'];
  };

  const SuccessModal = () => (
    <div className={styles.modalOverlay} onClick={() => setShowSuccessModal(false)}>
      <div className={styles.successModal} onClick={e => e.stopPropagation()}>
        <div className={styles.successIconWrapper}>
          <div className={styles.successIconCircle}>
            <FaCheck size={48} color="#ffffff" />
          </div>
        </div>
        
        <h2 className={styles.successTitle}>🚀 Grant Proposal Submitted!</h2>
        <p className={styles.successSubtitle}>
          Your proposal for <strong>"{submittedProject}"</strong> has been successfully submitted to AI for processing.
        </p>
        
        <div className={styles.successEmailSection}>
          <div className={styles.successEmailHeader}>
            <FaEnvelope size={18} color="#06b6d4" />
            <span className={styles.successEmailLabel}>📧 Sent to:</span>
          </div>
          <div className={styles.successEmailList}>
            {submittedEmails.map((email, index) => (
              <div key={index} className={styles.successEmailChip}>
                <FaEnvelope size={12} color="#06b6d4" />
                <span>{email}</span>
                <FaCheck size={12} color="#10b981" />
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.successNotes}>
          <div className={styles.successNote}>
            <FaClock size={16} color="#f97316" />
            <span>📬 You'll receive the email in <strong>2-5 minutes</strong></span>
          </div>
          <div className={styles.successNote}>
            <FaSearch size={16} color="#94a3b8" />
            <span>🔍 Check your <strong>spam folder</strong> if you don't see it</span>
          </div>
        </div>
        
        <div className={styles.successButtons}>
          {lastCreatedGrantId && (
            <button
              className={`${styles.successBtn} ${styles.successViewBtn}`}
              onClick={() => {
                setShowSuccessModal(false);
                navigate(`/grants/${lastCreatedGrantId}`);
              }}
            >
              View Proposal 📄
            </button>
          )}
          <button
            className={styles.successBtn}
            onClick={() => setShowSuccessModal(false)}
          >
            Got it! ✨
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <FaFileAlt size={24} color="#10b981" />
            </div>
            <div>
              <span className={styles.logoText}>GrantAI</span>
              <span className={styles.logoSub}>Proposal Generator</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { icon: FaFileAlt, color: '#06b6d4', value: stats.total, label: 'Total Grants', border: '#06b6d4' },
          { icon: FaAward, color: '#8b5cf6', value: stats.avgScore || '-', label: 'Avg Score', border: '#8b5cf6' },
          { icon: FaDollarSign, color: '#10b981', value: '$' + (stats.totalBudget || 0).toLocaleString(), label: 'Total Budget', border: '#10b981' }
        ].map((stat, index) => (
          <div key={index} className={styles.statCard} style={{ borderLeft: `3px solid ${stat.border}` }}>
            <div className={styles.statIconWrapper} style={{ background: `${stat.color}15` }}>
              <stat.icon color={stat.color} size={22} />
            </div>
            <div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <div className={styles.actionsLeft}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search grants by name, organization..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                <FaTimes size={14} />
              </button>
            )}
          </div>
        </div>
        <div className={styles.actionsRight}>
          {selectedGrants.length > 0 && (
            <button 
              className={styles.bulkDeleteBtn} 
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash size={14} />
                  Delete ({selectedGrants.length})
                </>
              )}
            </button>
          )}
          <button
            className={styles.createBtn}
            onClick={() => setShowModal(true)}
          >
            <FaPlus size={14} />
            New Grant
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className={styles.resultsCount}>
        <span>Showing <strong>{filteredGrants.length}</strong> grants</span>
        <span className={styles.resultsSub}>
          {grants.length > 0 && 'Last updated ' + formatDistanceToNow(new Date(grants[0]?.updatedAt || Date.now()), { addSuffix: true })}
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading grants...</p>
          </div>
        ) : filteredGrants.length === 0 ? (
          <div className={styles.emptyState}>
            <FaFileAlt size={64} color="#334155" />
            <h3>No grant applications yet</h3>
            <p>Create your first grant proposal and let AI do the magic</p>
            <button
              className={styles.createBtnLarge}
              onClick={() => setShowModal(true)}
            >
              <FaPlus />
              Create Your First Grant
            </button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thCheckbox}>
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className={styles.checkbox} />
                  </th>
                  <th className={styles.thProject}>Project</th>
                  <th className={styles.thOrg}>Organization</th>
                  <th className={styles.thBudget}>Budget</th>
                  <th className={styles.thScore}>Score</th>
                  <th className={styles.thSentTo}>Sent To</th>
                  <th className={styles.thDate}>Date</th>
                  <th className={styles.thActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrants.map(grant => {
                  const emails = getGrantEmails(grant);
                  return (
                    <tr key={grant._id} className={styles.tableRow}>
                      <td className={styles.tdCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedGrants.includes(grant._id)}
                          onChange={() => toggleSelect(grant._id)}
                          className={styles.checkbox}
                        />
                      </td>
                      <td className={styles.tdProject}>
                        <div className={styles.projectInfo}>
                          <div className={styles.projectIcon}>
                            <FaFileAlt size={16} color="#06b6d4" />
                          </div>
                          <div>
                            <div className={styles.projectName}>{grant.projectName}</div>
                            <div className={styles.projectDesc}>
                              {(grant.description || '').substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tdOrg}>
                        <div className={styles.orgInfo}>
                          <FaBuilding size={14} color="#94a3b8" />
                          <span>{grant.organization || '—'}</span>
                        </div>
                      </td>
                      <td className={styles.tdBudget}>
                        <span className={styles.budgetAmount}>
                          ${Number(grant.budget || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {grant.score ? (
                          <div className={styles.scoreCell}>
                            <span className={styles.scoreNumber} style={{ color: getScoreColor(grant.score) }}>
                              {grant.score}
                            </span>
                            <span className={styles.scoreStars}>
                              {getScoreStars(grant.score)}
                            </span>
                          </div>
                        ) : (
                          <span className={styles.noScore}>—</span>
                        )}
                      </td>
                      <td className={styles.tdSentTo}>
                        <div className={styles.sentToContainer}>
                          <FaEnvelope size={12} color="#94a3b8" className={styles.sentToIcon} />
                          <div className={styles.emailChips}>
                            {emails.slice(0, 2).map((email, idx) => (
                              <span key={idx} className={styles.sentToChip}>
                                {email}
                              </span>
                            ))}
                            {emails.length > 2 && (
                              <span className={styles.sentToMore}>
                                +{emails.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={styles.tdDate}>
                        <div className={styles.dateInfo}>
                          <FaCalendarAlt size={12} color="#94a3b8" />
                          <span>{format(new Date(grant.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button
                            className={`${styles.actionBtn} ${styles.viewBtn}`}
                            onClick={() => navigate(`/grants/${grant._id}`)}
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => { 
                              if (window.confirm(`⚠️ Are you sure you want to delete "${grant.projectName}"? This action cannot be undone!`)) {
                                setGrantToDelete(grant._id);
                                setShowDeleteModal(true);
                              }
                            }}
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={`${styles.modal} ${styles.deleteModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.deleteModalIcon}>
              <FaTrash size={40} color="#ef4444" />
            </div>
            <h2 className={styles.modalTitle}>Delete Grant?</h2>
            <p className={styles.deleteModalText}>
              This action cannot be undone. Are you sure you want to delete this grant?
            </p>
            <div className={styles.modalButtons}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.deleteConfirmBtn}
                onClick={() => handleDelete(grantToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className={styles.spinner} />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalGradientHeader}>
              <div className={styles.modalHeaderContent}>
                <div className={styles.modalIconWrapper}>
                  <FaRocket size={24} color="#10b981" />
                </div>
                <div className={styles.modalHeaderText}>
                  <h2 className={styles.modalTitle}>Create New Grant</h2>
                  <p className={styles.modalSubtitle}>AI-powered grant proposal generator</p>
                </div>
                <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                  <FaTimes size={20} color="#64748b" />
                </button>
              </div>
            </div>

            <form className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FaFileAlt size={12} color="#06b6d4" className={styles.formLabelIcon} />
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={newGrant.projectName}
                    onChange={e => setNewGrant({ ...newGrant, projectName: e.target.value })}
                    className={styles.modalInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FaDollarSign size={12} color="#10b981" className={styles.formLabelIcon} />
                    Budget (USD) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter budget amount"
                    value={newGrant.budget}
                    onChange={e => setNewGrant({ ...newGrant, budget: e.target.value })}
                    className={styles.modalInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaFileAlt size={12} color="#06b6d4" className={styles.formLabelIcon} />
                  Project Description *
                </label>
                <textarea
                  placeholder="Describe your project in detail..."
                  value={newGrant.description}
                  onChange={e => setNewGrant({ ...newGrant, description: e.target.value })}
                  className={`${styles.modalInput} ${styles.modalTextarea}`}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FaBuilding size={12} color="#94a3b8" className={styles.formLabelIcon} />
                    Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., NGO, Foundation, Company"
                    value={newGrant.organization}
                    onChange={e => setNewGrant({ ...newGrant, organization: e.target.value })}
                    className={styles.modalInput}
                  />
                  <div className={styles.fieldHint}>Appears in the PDF proposal</div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FaGlobe size={12} color="#94a3b8" className={styles.formLabelIcon} />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., City, Country"
                    value={newGrant.location}
                    onChange={e => setNewGrant({ ...newGrant, location: e.target.value })}
                    className={styles.modalInput}
                  />
                  <div className={styles.fieldHint}>Appears in the PDF proposal</div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FaGift size={12} color="#94a3b8" className={styles.formLabelIcon} />
                    Donor Type / Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Health, Education, Technology"
                    value={newGrant.donorType}
                    onChange={e => setNewGrant({ ...newGrant, donorType: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FaClock size={12} color="#94a3b8" className={styles.formLabelIcon} />
                    Project Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 24 months"
                    value={newGrant.duration}
                    onChange={e => setNewGrant({ ...newGrant, duration: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaBullseye size={12} color="#94a3b8" className={styles.formLabelIcon} />
                  Project Goals
                </label>
                <input
                  type="text"
                  placeholder="e.g., Improve healthcare access, Reduce poverty"
                  value={newGrant.goals}
                  onChange={e => setNewGrant({ ...newGrant, goals: e.target.value })}
                  className={styles.modalInput}
                />
                <div className={styles.fieldHint}>Used to generate SMART objectives</div>
              </div>

              {/* Email Section */}
              <div className={styles.emailSection}>
                <div className={styles.emailSectionHeader}>
                  <FaEnvelope size={16} color="#06b6d4" />
                  <label className={styles.formLabel}>Recipient Emails *</label>
                  <span className={styles.emailCount}>{newGrant.emails.length} recipient{newGrant.emails.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className={styles.emailInputWrapper}>
                  <input
                    type="text"
                    placeholder="Enter email address"
                    value={emailInput}
                    onChange={e => {
                      setEmailInput(e.target.value);
                      setEmailError('');
                    }}
                    onKeyPress={handleKeyPress}
                    className={`${styles.modalInput} ${styles.emailInput}`}
                  />
                  <button
                    type="button"
                    onClick={addEmail}
                    className={styles.addEmailBtn}
                  >
                    <FaPlus size={14} />
                    Add
                  </button>
                </div>
                {emailError && <div className={styles.emailError}>{emailError}</div>}

                <div className={styles.emailChipsContainer}>
                  {newGrant.emails.map((email, index) => (
                    <div key={index} className={styles.emailChipItem}>
                      <FaEnvelope size={12} color="#06b6d4" />
                      <span className={styles.emailChipText}>{email}</span>
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className={styles.removeEmailBtn}
                        title="Remove email"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.emailHelper}>
                  <FaInfoCircle size={12} color="#64748b" />
                  <span>PDF will be sent to all these email addresses</span>
                </div>
              </div>

              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateGrant}
                  className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className={styles.spinner} />
                      Submitting to AI...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Submit to AI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default Dashboard;