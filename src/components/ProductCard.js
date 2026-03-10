import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="product-image-wrap">
        {product.image
          ? <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} />
          : <div className="no-image">No Image</div>
        }
        {product.discount_percent > 0 && (
          <span className="discount-badge">{product.discount_percent}% OFF</span>
        )}
      </div>
      <div className="product-info">
        <p className="product-category">{product.category_name}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="price">₹{product.price}</span>
          {product.original_price && (
            <span className="original-price">₹{product.original_price}</span>
          )}
        </div>
        <button
          className="add-to-cart-btn"
          onClick={e => { e.stopPropagation(); addToCart(product); }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default ProductCard;