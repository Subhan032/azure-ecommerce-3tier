import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOrder }) => {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || FALLBACK_IMAGE);
  const isOutOfStock = product.stock <= 0;
  const formattedPrice = Number(product.price).toFixed(2);

  return (
    <article className="product-card">
      <div className="product-image-container">
        <img
          src={imgSrc}
          alt={product.name}
          className="product-image"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          loading="lazy"
        />
        <span className="product-badge">{product.category}</span>
      </div>

      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-box">
            <span className="product-price">${formattedPrice}</span>
            <span className={`product-stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={isOutOfStock}
            onClick={() => onOrder(product)}
            aria-label={`Order ${product.name}`}
          >
            {isOutOfStock ? (
              <>
                <Package size={16} /> Unavailable
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Order
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

