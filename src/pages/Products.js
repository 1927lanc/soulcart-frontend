import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const query = useQuery();
  const category = query.get('category') || '';
  const search = query.get('search') || '';

  useEffect(() => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/api/products/?';
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}&`;
    if (sort) url += `sort=${sort}`;
    axios.get(url)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, search, sort]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>
          {search ? `Search: "${search}"` : category ? category.replace('-', ' ').toUpperCase() : 'All Products'}
        </h2>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="low_to_high">Price: Low to High</option>
          <option value="high_to_low">Price: High to Low</option>
        </select>
      </div>
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default Products;