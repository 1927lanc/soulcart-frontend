import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

function Checkout() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { cartItems, cartTotal, fetchCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!address.trim()) {
      setError('Please enter your delivery address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'https://soulcart.onrender.com/api/orders/place/',
        { address },
        { headers: { Authorization: `Token ${token}` } }
      );
      await fetchCart();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    }
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <div className="checkout-left">
          <div className="checkout-box">
            <h3>Delivery Address</h3>
            {error && <div className="checkout-error">{error}</div>}
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              rows={5}
            />
            <button
              className="place-order-btn"
              onClick={handleOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : '🛒 PLACE ORDER'}
            </button>
          </div>
        </div>

        <div className="checkout-right">
          <div className="checkout-box">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div className="checkout-item" key={item.id}>
                <span>{item.product.name} x {item.quantity}</span>
                <span>₹{item.item_total}</span>
              </div>
            ))}
            <div className="checkout-divider" />
            <div className="checkout-total">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
