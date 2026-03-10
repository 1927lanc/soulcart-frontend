import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './OrderDetail.css';

function OrderDetail() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
      headers: { Authorization: `Token ${token}` }
    }).then(res => setOrder(res.data))
      .catch(err => console.log(err));
  }, [orderId, token]);

  if (!order) return <div className="order-loading">Loading order...</div>;

  return (
    <div className="order-detail-page">
      <div className="order-success-banner">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Order #{order.id} is confirmed</p>
      </div>

      <div className="order-detail-box">
        <div className="order-meta">
          <div className="order-meta-item">
            <span className="label">Order ID</span>
            <span className="value">#{order.id}</span>
          </div>
          <div className="order-meta-item">
            <span className="label">Status</span>
            <span className={`status-badge ${order.status}`}>{order.status.toUpperCase()}</span>
          </div>
          <div className="order-meta-item">
            <span className="label">Total</span>
            <span className="value">₹{order.total_price}</span>
          </div>
          <div className="order-meta-item">
            <span className="label">Date</span>
            <span className="value">{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="order-address">
          <h3>Delivery Address</h3>
          <p>{order.address}</p>
        </div>

        <div className="order-items">
          <h3>Items Ordered</h3>
          {order.items.map(item => (
            <div className="order-item" key={item.id}>
              <span>{item.product_name}</span>
              <span>x {item.quantity}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>

        <Link to="/orders" className="view-orders-btn">View All Orders</Link>
      </div>
    </div>
  );
}

export default OrderDetail;