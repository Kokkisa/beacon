import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

interface SyncBatch {
  id: string;
  platform: 'SHOPIFY' | 'AMAZON';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  total: number;
  success: number;
  failed: number;
  createdAt: string;
  completedAt?: string;
}

export default function Syncs() {
  const [syncs, setSyncs] = useState<SyncBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSyncs();
  }, []);

  const fetchSyncs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/syncs');
      setSyncs(response.data.batches);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch syncs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      PENDING: { bg: 'bg-yellow-900/30', text: 'text-yellow-400' },
      PROCESSING: { bg: 'bg-blue-900/30', text: 'text-blue-400' },
      COMPLETED: { bg: 'bg-green-900/30', text: 'text-green-400' },
      FAILED: { bg: 'bg-red-900/30', text: 'text-red-400' },
    };

    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`inline-block ${badge.bg} ${badge.text} px-3 py-1 rounded text-xs font-medium`}>
        {status}
      </span>
    );
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'SHOPIFY' ? '🛍️' : '🛒';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Syncs</h1>
          <p className="text-gray-400">Track and manage your fulfillment syncs</p>
        </div>
        <Link
          to="/syncs/new"
          className="bg-beacon-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          + New Sync
        </Link>
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
      ) : syncs.length === 0 ? (
        <div className="bg-beacon-card border border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No syncs yet</p>
          <Link
            to="/syncs/new"
            className="inline-block bg-beacon-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Your First Sync
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {syncs.map((sync) => (
            <Link
              key={sync.id}
              to={`/syncs/${sync.id}`}
              className="bg-beacon-card border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{getPlatformIcon(sync.platform)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{sync.platform}</h3>
                      {getStatusBadge(sync.status)}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {sync.total} items • {sync.success} synced • {sync.failed} failed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">
                    {new Date(sync.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {sync.completedAt
                      ? `Completed ${new Date(sync.completedAt).toLocaleTimeString()}`
                      : 'In progress'}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              {sync.total > 0 && (
                <div className="mt-4 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${(sync.success / sync.total) * 100}%` }}
                  ></div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
