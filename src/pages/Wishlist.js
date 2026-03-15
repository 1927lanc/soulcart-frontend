import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Wishlist() {
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = () => {
    axios.get('https://soulcart.onrender.com/api/users/wishlist/', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => { setWishlist(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const removeFromWishlist = async (productId) => {
    await axios.post('https://soulcart.onrender.com/api/users/wishlist/',
      { product_id: productId },
      { headers: { Authorization: `Token ${token}` } }
    );
    fetchWishlist();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '30px' }}>❤️ My Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💔</div>
          <p style={{ fontSize: '1.1rem' }}>Your wishlist is empty!</p>
          <button onClick={() => navigate('/products')}
            style={{ marginTop: '16px', padding: '12px 24px', background: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {wishlist.map(product => (
            <div key={product.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/products/${product.slug}`)}>
                {product.image
                  ? <img src={`https://soulcart.onrender.com${product.image}`} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', aspectRatio: '1', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
                }
                <button onClick={e => { e.stopPropagation(); removeFromWishlist(product.id); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  ❤️
                </button>
              </div>
              <div style={{ padding: '16px' }}>
                <p style={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category_name}</p>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px' }}>{product.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '800' }}>₹{product.price}</span>
                  {product.original_price && <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: '0.85rem' }}>₹{product.original_price}</span>}
                </div>
                <button onClick={() => addToCart(product)}
                  style={{ width: '100%', padding: '10px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
