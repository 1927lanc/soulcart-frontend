 import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="cart-empty">
        <h2>🛒 Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="shop-btn">START SHOPPING</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>My Cart ({cartCount} items)</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                {item.product.image
                  ? <img src={`http://127.0.0.1:8000${item.product.image}`} alt={item.product.name} />
                  : <div className="no-img">No Image</div>
                }
              </div>
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p className="cart-item-price">₹{item.product.price}</p>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="cart-item-right">
                <p className="item-total">₹{item.item_total}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free">FREE</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>

          {/* ✅ Changed from button to Link */}
          <Link to="/checkout" className="checkout-btn">
            PROCEED TO CHECKOUT
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;