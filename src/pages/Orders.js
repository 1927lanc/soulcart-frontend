import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/orders/', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="orders-loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="shop-now-btn">SHOP NOW</Link>
        </div>
      ) : (
        orders.map(order => (
          <div className="order-card" key={order.id}>
            <div className="order-card-header">
              <span>Order #{order.id}</span>
              <span className={`status-badge ${order.status}`}>{order.status.toUpperCase()}</span>
            </div>
            <div className="order-card-body">
              <p>{order.items.length} item(s)</p>
              <p className="order-total">₹{order.total_price}</p>
              <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <Link to={`/orders/${order.id}`} className="view-btn">View Details →</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders; 