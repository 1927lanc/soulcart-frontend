import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

function StarRating({ rating, onRate, interactive }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1,2,3,4,5].map(star => (
        <span key={star}
          style={{ fontSize: interactive ? '2rem' : '1.2rem', cursor: interactive ? 'pointer' : 'default',
            color: star <= (hover || rating) ? '#f4a100' : '#ddd' }}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}>
          ★
        </span>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const fetchProduct = () => {
    axios.get(`https://soulcart.onrender.com/api/products/${slug}/`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/products'); });
  };

  useEffect(() => { fetchProduct(); }, [slug]);

  const handleAddToCart = async () => {
    await addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    await axios.post('https://soulcart.onrender.com/api/users/wishlist/',
      { product_id: product.id },
      { headers: { Authorization: `Token ${token}` } }
    );
    setWishlisted(!wishlisted);
  };

  const handleReviewSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    if (!rating) { setReviewMsg('Please select a rating!'); return; }
    setSubmitting(true);
    try {
       await axios.post(`https://soulcart.onrender.com/api/products/${slug}/review/`,
        { rating, comment },
        { headers: { Authorization: `Token ${token}` } }
      );
      setReviewMsg('✅ Review submitted!');
      setRating(0);
      setComment('');
      fetchProduct();
    } catch {
      setReviewMsg('❌ Error submitting review.');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (!product) return null;

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="pd-page">
      <div className="pd-layout">
        <div className="pd-image-section">
          {product.image ? (
             <img src={product.image} alt={product.name} className="pd-main-image" />
          ) : (
            <div className="pd-no-image">No Image Available</div>
          )}
          {discount > 0 && <span className="pd-discount-badge">{discount}% OFF</span>}
        </div>

        <div className="pd-details">
          <p className="pd-category">{product.category_name}</p>
          <h1 className="pd-name">{product.name}</h1>

          {product.avg_rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <StarRating rating={Math.round(product.avg_rating)} interactive={false} />
              <span style={{ color: '#666', fontSize: '0.9rem' }}>{product.avg_rating} ({product.review_count} reviews)</span>
            </div>
          )}

          <div className="pd-price-row">
            <span className="pd-price">₹{product.price}</span>
            {product.original_price && <span className="pd-original">₹{product.original_price}</span>}
            {discount > 0 && <span className="pd-save">You save ₹{product.original_price - product.price}!</span>}
          </div>
          {product.description && (
            <div className="pd-description">
              <h3>About this product</h3>
              <p>{product.description}</p>
            </div>
          )}
          <div className="pd-stock">
            {product.stock > 0
              ? <span className="in-stock">✅ In Stock ({product.stock} left)</span>
              : <span className="out-stock">❌ Out of Stock</span>}
          </div>
          <button className={`pd-add-btn ${added ? 'added' : ''}`} onClick={handleAddToCart} disabled={product.stock === 0}>
            {added ? '✅ ADDED TO CART!' : '🛒 ADD TO CART'}
          </button>
          <button className="pd-buy-btn" onClick={() => { handleAddToCart(); navigate('/checkout'); }}>
            ⚡ BUY NOW
          </button>
          <button className="pd-wish-btn" onClick={handleWishlist}>
            {wishlisted ? '❤️ WISHLISTED' : '🤍 ADD TO WISHLIST'}
          </button>
          <div className="pd-features">
            <div className="pd-feature">🚚 Free Delivery on orders above ₹499</div>
            <div className="pd-feature">↩️ Easy 7-day returns</div>
            <div className="pd-feature">✅ 100% Authentic Products</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pd-reviews">
        <h2 className="pd-reviews-title">Customer Reviews</h2>
        <div className="pd-review-form">
          <h3>{user ? 'Write a Review' : 'Login to Write a Review'}</h3>
          {user ? (
            <>
              <StarRating rating={rating} onRate={setRating} interactive={true} />
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="pd-review-textarea"
              />
              {reviewMsg && <p style={{ color: reviewMsg.includes('✅') ? 'green' : 'red' }}>{reviewMsg}</p>}
              <button className="pd-review-submit" onClick={handleReviewSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </>
          ) : (
            <button className="pd-add-btn" onClick={() => navigate('/login')}>Login to Review</button>
          )}
        </div>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map(review => (
            <div key={review.id} className="pd-review-card">
              <div className="pd-review-header">
                <div className="pd-review-avatar">{review.username[0].toUpperCase()}</div>
                <div>
                  <div className="pd-review-username">{review.username}</div>
                  <StarRating rating={review.rating} interactive={false} />
                </div>
                <div className="pd-review-date">{new Date(review.created_at).toLocaleDateString()}</div>
              </div>
              {review.comment && <p className="pd-review-comment">{review.comment}</p>}
            </div>
          ))
        ) : (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;