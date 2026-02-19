import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messagesAPI, Message, adminAPI } from '../services/consultancyAPI';
import './MessagesPage.css';

type Tab = 'inbox' | 'sent' | 'compose' | 'support';

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('inbox');
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sent, setSent] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Compose form
  const [composeForm, setComposeForm] = useState({
    toUserId: '',
    subject: '',
    body: '',
    isSupport: false,
  });
  const [sending, setSending] = useState(false);

  // Selected message detail
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Users list for compose
  const [users, setUsers] = useState<{ id: string; firstName: string | null; lastName: string | null; email: string }[]>([]);

  useEffect(() => {
    loadMessages();
    loadUsers();

    // Check if navigated from partner card
    const state = location.state as any;
    if (state?.toPartner) {
      setActiveTab('compose');
      setComposeForm({
        ...composeForm,
        subject: `Inquiry about ${(state.toPartner as any).companyName || state.toPartner.name}`,
      });
    }
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const [receivedRes, sentRes] = await Promise.allSettled([
        messagesAPI.getReceived(),
        messagesAPI.getSent(),
      ]);
      if (receivedRes.status === 'fulfilled' && receivedRes.value.success && receivedRes.value.data) {
        setInbox(receivedRes.value.data);
      }
      if (sentRes.status === 'fulfilled' && sentRes.value.success && sentRes.value.data) {
        setSent(sentRes.value.data);
      }
    } catch {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.success && res.data) {
        setUsers(res.data.map((u: any) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email })));
      }
    } catch {
      // Non-admin users may not have access - ignore
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.body.trim()) {
      setError('Message body is required');
      return;
    }
    setSending(true);
    setError('');
    setSuccessMsg('');
    try {
      const data: any = {
        body: composeForm.body,
      };
      if (composeForm.toUserId) data.toUserId = composeForm.toUserId;
      if (composeForm.subject) data.subject = composeForm.subject;
      if (composeForm.isSupport) data.isSupport = true;

      const res = await messagesAPI.send(data);
      if (res.success) {
        setSuccessMsg('Message sent successfully!');
        setComposeForm({ toUserId: '', subject: '', body: '', isSupport: false });
        loadMessages();
        setTimeout(() => setActiveTab('sent'), 1000);
      } else {
        setError(res.error || 'Failed to send message');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await messagesAPI.markAsRead(id);
      setInbox(inbox.map((m) => (m.id === id ? { ...m, status: 'READ' } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'READ' });
      }
    } catch {
      console.error('Failed to mark as read');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await messagesAPI.archive(id);
      setInbox(inbox.filter((m) => m.id !== id));
      setSent(sent.filter((m) => m.id !== id));
      setSelectedMessage(null);
    } catch {
      setError('Failed to archive');
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const userName = (u?: { firstName: string | null; lastName: string | null; email: string }) => {
    if (!u) return 'System';
    if (u.firstName || u.lastName) return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    return u.email;
  };

  const unreadCount = inbox.filter((m) => m.status === 'SENT').length;

  return (
    <div className="messages-page">
      <header className="msg-header">
        <div className="msg-header-inner">
          <div className="msg-brand">
            <span className="msg-logo-mark">A</span>
            <div>
              <h1>Messages</h1>
              <span className="msg-subtitle">Communications & Support</span>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-back-dash">
            Dashboard
          </button>
        </div>
      </header>

      <div className="msg-container">
        <nav className="msg-tabs">
          <button className={`tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}>
            Inbox {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </button>
          <button className={`tab ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => { setActiveTab('sent'); setSelectedMessage(null); }}>
            Sent
          </button>
          <button className={`tab ${activeTab === 'compose' ? 'active' : ''}`} onClick={() => { setActiveTab('compose'); setSelectedMessage(null); }}>
            Compose
          </button>
          {user?.role === 'ADMIN' && (
            <button className={`tab ${activeTab === 'support' ? 'active' : ''}`} onClick={() => { setActiveTab('support'); setSelectedMessage(null); }}>
              Support Tickets
            </button>
          )}
        </nav>

        {error && <div className="msg-alert error"><span>{error}</span><button onClick={() => setError('')}>x</button></div>}
        {successMsg && <div className="msg-alert success"><span>{successMsg}</span><button onClick={() => setSuccessMsg('')}>x</button></div>}

        {/* MESSAGE DETAIL MODAL */}
        {selectedMessage && (
          <div className="msg-modal-overlay" onClick={() => setSelectedMessage(null)}>
            <div className="msg-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedMessage(null)}>x</button>
              <div className="msg-detail-header">
                <h2>{selectedMessage.subject || '(No Subject)'}</h2>
                <span className={`msg-status-badge ${selectedMessage.status.toLowerCase()}`}>{selectedMessage.status}</span>
              </div>
              <div className="msg-detail-meta">
                <span>From: <strong>{userName(selectedMessage.fromUser)}</strong></span>
                <span>To: <strong>{selectedMessage.toUser ? userName(selectedMessage.toUser) : 'Support'}</strong></span>
                <span>{formatDate(selectedMessage.createdAt)}</span>
              </div>
              <div className="msg-detail-body">
                {selectedMessage.body}
              </div>
              <div className="msg-detail-actions">
                {selectedMessage.status === 'SENT' && (
                  <button className="btn-mark-read" onClick={() => handleMarkRead(selectedMessage.id)}>
                    Mark as Read
                  </button>
                )}
                <button className="btn-archive" onClick={() => handleArchive(selectedMessage.id)}>
                  Archive
                </button>
                <button className="btn-reply" onClick={() => {
                  setSelectedMessage(null);
                  setActiveTab('compose');
                  setComposeForm({
                    toUserId: selectedMessage.fromUserId,
                    subject: `Re: ${selectedMessage.subject || ''}`,
                    body: '',
                    isSupport: false,
                  });
                }}>
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INBOX TAB */}
        {activeTab === 'inbox' && (
          <div className="tab-content">
            {loading ? (
              <div className="msg-loading"><div className="loading-spinner" /><p>Loading messages...</p></div>
            ) : inbox.length === 0 ? (
              <div className="msg-empty">
                <p>No messages in your inbox</p>
                <button onClick={() => setActiveTab('compose')} className="btn-compose-new">Compose Message</button>
              </div>
            ) : (
              <div className="msg-list">
                {inbox.map((msg) => (
                  <div
                    key={msg.id}
                    className={`msg-item ${msg.status === 'SENT' ? 'unread' : ''}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'SENT') handleMarkRead(msg.id);
                    }}
                  >
                    <div className="msg-item-indicator">
                      {msg.status === 'SENT' && <span className="unread-dot" />}
                    </div>
                    <div className="msg-item-content">
                      <div className="msg-item-top">
                        <span className="msg-from">{userName(msg.fromUser)}</span>
                        <span className="msg-date">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="msg-subject">{msg.subject || '(No Subject)'}</p>
                      <p className="msg-preview">{msg.body.substring(0, 100)}{msg.body.length > 100 ? '...' : ''}</p>
                    </div>
                    {msg.isSupport && <span className="support-badge">Support</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SENT TAB */}
        {activeTab === 'sent' && (
          <div className="tab-content">
            {loading ? (
              <div className="msg-loading"><div className="loading-spinner" /><p>Loading...</p></div>
            ) : sent.length === 0 ? (
              <div className="msg-empty"><p>No sent messages</p></div>
            ) : (
              <div className="msg-list">
                {sent.map((msg) => (
                  <div key={msg.id} className="msg-item" onClick={() => setSelectedMessage(msg)}>
                    <div className="msg-item-content">
                      <div className="msg-item-top">
                        <span className="msg-from">To: {msg.toUser ? userName(msg.toUser) : 'Support'}</span>
                        <span className="msg-date">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="msg-subject">{msg.subject || '(No Subject)'}</p>
                      <p className="msg-preview">{msg.body.substring(0, 100)}{msg.body.length > 100 ? '...' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPOSE TAB */}
        {activeTab === 'compose' && (
          <div className="tab-content">
            <div className="compose-panel">
              <h3>New Message</h3>
              <form onSubmit={handleSend} className="compose-form">
                <div className="form-group">
                  <label>To</label>
                  {users.length > 0 ? (
                    <select
                      value={composeForm.toUserId}
                      onChange={(e) => setComposeForm({ ...composeForm, toUserId: e.target.value })}
                    >
                      <option value="">Support (No Specific User)</option>
                      {users.filter((u) => u.id !== (user as any)?.id).map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : u.email}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={composeForm.toUserId}
                      onChange={(e) => setComposeForm({ ...composeForm, toUserId: e.target.value })}
                      placeholder="User ID (leave empty for support)"
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                    placeholder="Message subject"
                  />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    value={composeForm.body}
                    onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                    placeholder="Type your message..."
                    rows={8}
                    required
                  />
                </div>
                <div className="form-check">
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={composeForm.isSupport}
                      onChange={(e) => setComposeForm({ ...composeForm, isSupport: e.target.checked })}
                    />
                    <span>Send as support ticket</span>
                  </label>
                </div>
                <button type="submit" className="btn-send" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SUPPORT TAB (Admin only) */}
        {activeTab === 'support' && user?.role === 'ADMIN' && (
          <SupportTickets />
        )}
      </div>
    </div>
  );
}

function SupportTickets() {
  const [tickets, setTickets] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await messagesAPI.getSupportTickets();
      if (res.success && res.data) {
        setTickets(res.data);
      }
    } catch {
      console.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="msg-loading"><div className="loading-spinner" /><p>Loading tickets...</p></div>;

  return (
    <div className="tab-content">
      {tickets.length === 0 ? (
        <div className="msg-empty"><p>No support tickets</p></div>
      ) : (
        <div className="msg-list">
          {tickets.map((t) => (
            <div key={t.id} className="msg-item support-item">
              <div className="msg-item-content">
                <div className="msg-item-top">
                  <span className="msg-from">
                    {t.fromUser ? `${t.fromUser.firstName || ''} ${t.fromUser.lastName || ''}`.trim() || t.fromUser.email : 'Unknown'}
                  </span>
                  <span className="msg-date">
                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="msg-subject">{t.subject || '(No Subject)'}</p>
                <p className="msg-preview">{t.body.substring(0, 150)}{t.body.length > 150 ? '...' : ''}</p>
              </div>
              <span className={`msg-status-tag ${t.status.toLowerCase()}`}>{t.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
