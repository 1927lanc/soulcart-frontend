 import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://127.0.0.1:8000/api/orders/', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, token, navigate]);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ background: '#1a1a1a', color: 'white', borderRadius: '16px', padding: '40px', marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#e63946', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
          {user.username[0].toUpperCase()}
        </div>
        <h2 style={{ margin: '0 0 8px' }}>{user.username}</h2>
        <p style={{ color: '#aaa', margin: 0 }}>{user.email}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '30px' }}>
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Total Spent', value: `₹${totalSpent.toFixed(0)}` },
          { label: 'Delivered', value: delivered }
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#e63946' }}>{stat.value}</div>
            <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 20px', fontWeight: '800' }}>Recent Orders</h3>
        {loading ? <p>Loading...</p> : orders.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No orders yet!</p>
        ) : orders.slice(0, 5).map(order => (
          <div key={order.id} onClick={() => navigate(`/orders/${order.id}`)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: '700' }}>Order #{order.id}</div>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700' }}>₹{order.total_price}</div>
              <span style={{ background: order.status === 'delivered' ? '#e8f5e9' : '#fff3e0', color: order.status === 'delivered' ? '#2e7d32' : '#e65100', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;