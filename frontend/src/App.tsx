import React, { useEffect, useState, useMemo } from 'react';
import { Product } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { OrderModal } from './components/OrderModal';
import { Search, AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrderProduct, setActiveOrderProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`Failed to load catalog (HTTP ${response.status})`);
      }
      const result = await response.json();
      setProducts(result.data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Could not load products. Please check if backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Compute categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...unique];
  }, [products]);

  // Filter products by active category and search keyword
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOrderSuccess = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p))
    );
  };

  return (
    <div>
      <Header />

      <main className="container">
        <section className="hero">
          <h1>Cloud E-Commerce Catalog</h1>
          <p>
            Browse high-performance developer accessories and electronics backed by Azure PostgreSQL &amp; Container Apps.
          </p>
        </section>

        <div className="controls-bar">
          <div className="category-tabs" role="tablist">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`tab-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Loading catalog items from API...</p>
          </div>
        ) : errorMessage ? (
          <div className="state-box">
            <AlertCircle size={40} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
            <h3>Unable to fetch products</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>{errorMessage}</p>
            <button type="button" className="btn btn-outline" onClick={fetchProducts}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="state-box">
            <ShoppingBag size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3>No products found</h3>
            <p style={{ marginTop: '0.5rem' }}>
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={(prod) => setActiveOrderProduct(prod)}
              />
            ))}
          </div>
        )}
      </main>

      {activeOrderProduct && (
        <OrderModal
          product={activeOrderProduct}
          onClose={() => setActiveOrderProduct(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};

