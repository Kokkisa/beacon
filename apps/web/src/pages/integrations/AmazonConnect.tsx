import { useState } from 'react';
import api from '../../utils/api';

interface AmazonConnectProps {
  onConnected: () => void;
}

export default function AmazonConnect({ onConnected }: AmazonConnectProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    sellerCentralId: '',
    marketplaceId: 'ATVPDKIKX0DER', // US
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/api/integrations/amazon/connect', formData);
      onConnected();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to connect Amazon account');
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
        <label htmlFor="clientId" className="block text-sm text-gray-400 mb-2">
          Client ID
        </label>
        <input
          id="clientId"
          name="clientId"
          type="text"
          placeholder="Your LWA Client ID"
          value={formData.clientId}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded text-sm focus:border-beacon-blue focus:outline-none disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="clientSecret" className="block text-sm text-gray-400 mb-2">
          Client Secret
        </label>
        <input
          id="clientSecret"
          name="clientSecret"
          type="password"
          placeholder="Your LWA Client Secret"
          value={formData.clientSecret}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded text-sm focus:border-beacon-blue focus:outline-none disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="sellerCentralId" className="block text-sm text-gray-400 mb-2">
          Seller Central ID
        </label>
        <input
          id="sellerCentralId"
          name="sellerCentralId"
          type="text"
          placeholder="Your Seller Central ID"
          value={formData.sellerCentralId}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded text-sm focus:border-beacon-blue focus:outline-none disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="marketplaceId" className="block text-sm text-gray-400 mb-2">
          Marketplace
        </label>
        <select
          id="marketplaceId"
          name="marketplaceId"
          value={formData.marketplaceId}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded text-sm focus:border-beacon-blue focus:outline-none disabled:opacity-50"
        >
          <option value="ATVPDKIKX0DER">United States</option>
          <option value="A2EUQ1WTGBLTLM">Canada</option>
          <option value="A1AM78C64UM0Y8">Mexico</option>
          <option value="A1PA6795UKMFR9">United Kingdom</option>
          <option value="A1RJVKC6E5NXGA">France</option>
          <option value="A1F83G8C2ARO7P">Germany</option>
          <option value="APJ6JRA9NG5V4">Japan</option>
          <option value="A2Q3Y263D00KWC">Australia</option>
        </select>
      </div>

      <p className="text-gray-500 text-xs">
        Get your credentials from Amazon Selling Partner Central &rarr; Settings &rarr; Registered Applications
      </p>

      <button
        type="submit"
        disabled={loading || !formData.clientId || !formData.clientSecret || !formData.sellerCentralId}
        className="w-full bg-beacon-blue hover:bg-blue-600 disabled:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
      >
        {loading ? 'Connecting...' : 'Connect Amazon'}
      </button>
    </form>
  );
}
