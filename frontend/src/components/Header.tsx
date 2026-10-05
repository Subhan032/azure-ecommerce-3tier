import React, { useEffect, useState } from 'react';
import { ShoppingCart, Server } from 'lucide-react';

export const Header: React.FC = () => {
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsApiHealthy(data.status === 'healthy');
      })
      .catch(() => {
        setIsApiHealthy(false);
      });
  }, []);

  return (
    <header className="header">
      <div className="container header-content">
        <a href="/" className="brand">
          <ShoppingCart className="brand-icon" />
          <span className="brand-title">Azure Cloud Store</span>
          <span className="brand-badge">3-Tier Architecture</span>
        </a>

        <div className="header-status">
          <Server size={16} />
          <span>API:</span>
          {isApiHealthy === null ? (
            <span>Checking...</span>
          ) : isApiHealthy ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981' }}>
              <span className="status-dot"></span> Online
            </span>
          ) : (
            <span style={{ color: '#ef4444' }}>Degraded / Offline</span>
          )}
        </div>
      </div>
    </header>
  );
};

