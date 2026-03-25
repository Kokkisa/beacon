import { useEffect, useState } from 'react';
import api from '../../utils/api';
import ShopifyConnect from './ShopifyConnect';
import AmazonConnect from './AmazonConnect';

interface Integration {
  id: string;
  platform: 'SHOPIFY' | 'AMAZON';
  isActive: boolean;
  shopUrl?: string;
  sellerId?: string;
  marketplaceId?: string;
  createdAt: string;
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/integrations');
      setIntegrations(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationAdded = () => {
    fetchIntegrations();
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!window.confirm('Are you sure you want to disconnect this integration?')) {
      return;
    }

    try {
      await api.delete(`/api/integrations/${integrationId}`);
      fetchIntegrations();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to disconnect');
    }
  };

  const shopifyIntegration = integrations.find((i) => i.platform === 'SHOPIFY');
  const amazonIntegration = integrations.find((i) => i.platform === 'AMAZON');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
        <p className="text-gray-400">Connect your sales channels and fulfillment platforms</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beacon-amber"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shopify */}
          <div className="bg-beacon-card border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🛍️</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Shopify</h2>
                  <p className="text-gray-400 text-sm">Sell on your own store</p>
                </div>
              </div>
              {shopifyIntegration?.isActive && (
                <span className="inline-block bg-green-900/30 text-green-400 px-3 py-1 rounded text-xs font-medium">
                  Connected
                </span>
              )}
            </div>

            {shopifyIntegration?.isActive ? (
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded p-3 text-sm">
                  <p className="text-gray-400">Store: {shopifyIntegration.shopUrl}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Connected {new Date(shopifyIntegration.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDisconnect(shopifyIntegration.id)}
                  className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <ShopifyConnect onConnected={handleIntegrationAdded} />
            )}
          </div>

          {/* Amazon */}
          <div className="bg-beacon-card border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🛒</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Amazon</h2>
                  <p className="text-gray-400 text-sm">Sell on Amazon.com</p>
                </div>
              </div>
              {amazonIntegration?.isActive && (
                <span className="inline-block bg-green-900/30 text-green-400 px-3 py-1 rounded text-xs font-medium">
                  Connected
                </span>
              )}
            </div>

            {amazonIntegration?.isActive ? (
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded p-3 text-sm">
                  <p className="text-gray-400">Seller ID: {amazonIntegration.sellerId}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Connected {new Date(amazonIntegration.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDisconnect(amazonIntegration.id)}
                  className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <AmazonConnect onConnected={handleIntegrationAdded} />
            )}
          </div>

          {/* Coming Soon */}
          <div className="bg-beacon-card border border-gray-700 rounded-lg p-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">📦</span>
              <div>
                <h2 className="text-xl font-bold text-white">Printful</h2>
                <p className="text-gray-400 text-sm">Print-on-demand fulfillment</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Coming soon</p>
          </div>

          <div className="bg-beacon-card border border-gray-700 rounded-lg p-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">📮</span>
              <div>
                <h2 className="text-xl font-bold text-white">Spocket</h2>
                <p className="text-gray-400 text-sm">Dropshipping & print-on-demand</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
