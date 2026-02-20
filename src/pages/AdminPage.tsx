import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminPage.css';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isVerified: !currentStatus });
      loadUsers();
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Welcome, {user?.name || user?.email}
        </p>

        {/* Users Table */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginBottom: 16 }}>Users</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px' }}>Name</th>
                  <th style={{ padding: '10px 8px' }}>Email</th>
                  <th style={{ padding: '10px 8px' }}>Role</th>
                  <th style={{ padding: '10px 8px' }}>Verified</th>
                  <th style={{ padding: '10px 8px' }}>Joined</th>
                  <th style={{ padding: '10px 8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 8px' }}>
                      {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td style={{ padding: '10px 8px' }}>{u.email}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        background: u.role === 'ADMIN' ? '#e74c3c' : '#3498db',
                        color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {u.isVerified ? '✅' : '❌'}
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: '0.85rem', color: '#888' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <button
                        onClick={() => toggleVerified(u.id, u.isVerified)}
                        style={{
                          padding: '4px 12px', borderRadius: 4, border: '1px solid #ccc',
                          background: '#f9f9f9', cursor: 'pointer', fontSize: '0.8rem'
                        }}
                      >
                        {u.isVerified ? 'Deactivate' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;