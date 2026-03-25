import { useState } from 'react';
import api from '../../utils/api';

interface ShopifyConnectProps {
  onConnected?: () => void;
}

export default function ShopifyConnect({ onConnected: _onConnected }: ShopifyConnectProps) {
  const [shop, setShop] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/integrations/shopify/auth', { shop });

      // Redirect to Shopify OAuth
      window.location.href = response.data.authUrl;
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to initiate Shopify connection');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleConnect} className="space-y-3">
      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="shop" className="block text-sm text-gray-400 mb-2">
          Your Shopify Store URL
        </label>
        <input
          id="shop"
          type="text"
          placeholder="mystore.myshopify.com or mystore"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          disabled={loading}
          className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded text-sm focus:border-beacon-blue focus:outline-none disabled:opacity-50"
        />
        <p className="text-gray-500 text-xs mt-1">Enter your Shopify store URL (e.g., mystore.myshopify.com)</p>
      </div>

      <button
        type="submit"
        disabled={loading || !shop}
        className="w-full bg-beacon-blue hover:bg-blue-600 disabled:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
      >
        {loading ? 'Connecting...' : 'Connect Shopify'}
      </button>
    </form>
  );
}
