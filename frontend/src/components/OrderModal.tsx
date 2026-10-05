import React, { useState } from 'react';
import { Product, CreatedOrder } from '../types';
import { X, CheckCircle, AlertCircle, ShoppingCart } from 'lucide-react';

interface OrderModalProps {
  product: Product;
  onClose: () => void;
  onOrderSuccess: (productId: string, quantity: number) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ product, onClose, onOrderSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<CreatedOrder | null>(null);

  const unitPrice = Number(product.price);
  const calculatedTotal = (unitPrice * quantity).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          shippingAddress: shippingAddress.trim(),
          items: [
            {
              productId: product.id,
              quantity: Number(quantity),
            },
          ],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order.');
      }

      setCompletedOrder(result.data);
      onOrderSuccess(product.id, quantity);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred while placing your order.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {completedOrder ? 'Order Confirmed!' : `Order ${product.name}`}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {completedOrder ? (
          <div className="order-success-card">
            <div className="success-icon-wrap">
              <CheckCircle size={32} />
            </div>
            <h3>Thank you for your order, {completedOrder.customerName}!</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Your order has been recorded in the database.
            </p>
            <div className="order-id-badge">Order ID: {completedOrder.id}</div>

            <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>Item:</span>
                <span style={{ fontWeight: 600 }}>{product.name} (x{quantity})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>Total Charged:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>${Number(completedOrder.totalAmount).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Ship To:</span>
                <span style={{ fontSize: '0.85rem' }}>{completedOrder.shippingAddress}</span>
              </div>
            </div>

            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="order-item-summary">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="order-item-img" />
                )}
                <div className="order-item-info">
                  <h4>{product.name}</h4>
                  <p>${unitPrice.toFixed(2)} each &bull; {product.category}</p>
                </div>
              </div>

              {errorMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="customerName">Full Name</label>
                <input
                  id="customerName"
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="customerEmail">Email Address</label>
                <input
                  id="customerEmail"
                  type="email"
                  required
                  placeholder="e.g. jane@example.com"
                  className="form-input"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shippingAddress">Shipping Address</label>
                <input
                  id="shippingAddress"
                  type="text"
                  required
                  placeholder="e.g. 123 Main Street, Suite 4B, City, Country"
                  className="form-input"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={product.stock}
                  required
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  disabled={isSubmitting}
                />
              </div>

              <div className="order-total-row">
                <span>Order Total:</span>
                <span style={{ color: '#0078d4' }}>${calculatedTotal}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <ShoppingCart size={16} />
                {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

