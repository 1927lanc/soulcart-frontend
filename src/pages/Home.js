import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [tshirts, setTshirts] = useState([]);
  const [sneakers, setSneakers] = useState([]);
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/').then(res => setFeatured(res.data.slice(0, 8)));
    axios.get('http://127.0.0.1:8000/api/products/?category=t-shirts').then(res => setTshirts(res.data.slice(0, 4)));
    axios.get('http://127.0.0.1:8000/api/products/?category=sneakers').then(res => setSneakers(res.data.slice(0, 4)));
    axios.get('http://127.0.0.1:8000/api/products/?category=accessories').then(res => setAccessories(res.data.slice(0, 4)));
  }, []);

  return (
    <div className="home">

      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <h1>Express Yourself</h1>
          <p>Discover the latest in fan merchandise and streetwear</p>
          <Link to="/products" className="hero-btn">SHOP NOW</Link>
        </div>
      </div>

      {/* Category Banners */}
      <div className="category-banners">
        <Link to="/products?category=t-shirts" className="banner banner-tshirts">
          <div className="banner-content">
            <h3>T-Shirts</h3>
            <p>Fan merch & streetwear</p>
            <span className="banner-link">Shop Now →</span>
          </div>
        </Link>
        <Link to="/products?category=sneakers" className="banner banner-sneakers">
          <div className="banner-content">
            <h3>Sneakers</h3>
            <p>Step up your game</p>
            <span className="banner-link">Shop Now →</span>
          </div>
        </Link>
        <Link to="/products?category=accessories" className="banner banner-accessories">
          <div className="banner-content">
            <h3>Accessories</h3>
            <p>Complete your look</p>
            <span className="banner-link">Shop Now →</span>
          </div>
        </Link>
      </div>

      {/* Featured Products */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="see-all">See All →</Link>
        </div>
        <div className="product-grid">
          {featured.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>

      {/* T-Shirts Section */}
      {tshirts.length > 0 && (
        <div className="section section-dark">
          <div className="section-header">
            <h2 className="section-title">👕 T-Shirts</h2>
            <Link to="/products?category=t-shirts" className="see-all">See All →</Link>
          </div>
          <div className="product-grid">
            {tshirts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      )}

      {/* Sneakers Section */}
      {sneakers.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">👟 Sneakers</h2>
            <Link to="/products?category=sneakers" className="see-all">See All →</Link>
          </div>
          <div className="product-grid">
            {sneakers.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      )}

      {/* Accessories Section */}
      {accessories.length > 0 && (
        <div className="section section-dark">
          <div className="section-header">
            <h2 className="section-title">⌚ Accessories</h2>
            <Link to="/products?category=accessories" className="see-all">See All →</Link>
          </div>
          <div className="product-grid">
            {accessories.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      )}

      {/* Features Banner */}
      <div className="features-strip">
        <div className="feature-item">🚚 <span>Free Delivery above ₹499</span></div>
        <div className="feature-item">↩️ <span>Easy 7-day Returns</span></div>
        <div className="feature-item">✅ <span>100% Authentic Products</span></div>
        <div className="feature-item">🔒 <span>Secure Payments</span></div>
      </div>

    </div>
  );
}

export default Home; 