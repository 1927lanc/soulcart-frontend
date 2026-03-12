 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://soulcart.onrender.com/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${search}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="logo">🛒 SoulCart</Link>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
        <div className="navbar-icons">
          {user ? (
            <>
               <Link to="/profile" className="icon-btn">👤 {user.username}</Link>
               <Link to="/wishlist" className="icon-btn">❤️ Wishlist</Link>
               <Link to="/orders" className="icon-btn">📦 Orders</Link> 
              <button className="icon-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="icon-btn">👤 Login</Link>
              <Link to="/register" className="icon-btn register-btn">Register</Link>
            </>
          )}
          <Link to="/cart" className="icon-btn">
            🛒 Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
      <div className="navbar-bottom">
         {categories.filter(cat => cat.name !== 'Accessories').map(cat => (
          <div className="dropdown" key={cat.id}>
            <button className="dropdown-btn">{cat.name} ▾</button>
            <div className="dropdown-content">
              {cat.subcategories && cat.subcategories.map(sub => (
                <Link
                  key={sub.id}
                  to={`/products?category=${sub.slug}`}
                  className="dropdown-item"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link to="/products?category=accessories" className="dropdown-btn">Accessories</Link>
        <Link to="/products" className="dropdown-btn">All Products</Link>
      </div>
    </nav>
  );
}

export default Navbar;