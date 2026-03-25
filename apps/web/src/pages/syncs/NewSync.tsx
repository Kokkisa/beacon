import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

type TabType = 'csv' | 'manual';

interface SyncItem {
  orderId: string;
  trackingNumber: string;
  carrier?: string;
}

export default function NewSync() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabType>('csv');
  const [platform, setPlatform] = useState<'SHOPIFY' | 'AMAZON'>('SHOPIFY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // CSV Tab
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<SyncItem[]>([]);

  // Manual Tab
  const [manualData, setManualData] = useState({
    orderId: '',
    trackingNumber: '',
    carrier: '',
  });

  const handleCSVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setError(null);

    // Preview CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const items: SyncItem[] = [];

      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const [orderId, trackingNumber, carrier] = lines[i].split(',');
        if (orderId && trackingNumber) {
          items.push({
            orderId: orderId.trim(),
            trackingNumber: trackingNumber.trim(),
            carrier: carrier?.trim(),
          });
        }
      }

      setCsvPreview(items);
    };
    reader.readAsText(file);
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('platform', platform);

      const response = await api.post('/api/syncs/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/syncs/${response.data.batchId}`);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload CSV');
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (!manualData.orderId || !manualData.trackingNumber) {
      setError('Order ID and Tracking Number are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/syncs/manual', {
        platform,
        ...manualData,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/syncs/${response.data.batchId}`);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create sync');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">New Sync</h1>
        <p className="text-gray-400">Upload tracking numbers to sync with your store</p>
      </div>

      {success && (
        <div className="bg-green-900/20 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
          ✓ Sync created successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-beacon-card border border-gray-700 rounded-lg p-6">
        {/* Platform Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Which platform?
          </label>
          <div className="flex gap-4">
            {['SHOPIFY', 'AMAZON'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p as any)}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                  platform === p
                    ? 'bg-beacon-blue border-beacon-blue text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                {p === 'SHOPIFY' ? '🛍️' : '🛒'} {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {['csv', 'manual'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as TabType)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-beacon-blue text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {t === 'csv' ? '📄 CSV Upload' : '✏️ Manual Entry'}
            </button>
          ))}
        </div>

        {/* CSV Tab */}
        {tab === 'csv' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Upload CSV File
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVChange}
                  className="hidden"
                  id="csv-input"
                  disabled={loading}
                />
                <label htmlFor="csv-input" className="cursor-pointer">
                  <p className="text-gray-400">📁 {csvFile?.name || 'Drag & drop or click to select'}</p>
                  <p className="text-gray-500 text-xs mt-2">CSV format: orderId, trackingNumber, carrier</p>
                </label>
              </div>
            </div>

            {csvPreview.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Preview (first 5 rows):</p>
                <div className="bg-gray-800 rounded p-4 space-y-2">
                  {csvPreview.map((item, i) => (
                    <div key={i} className="text-xs text-gray-300 font-mono">
                      {item.orderId} → {item.trackingNumber} ({item.carrier || 'auto-detect'})
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCSVUpload}
              disabled={!csvFile || loading}
              className="w-full bg-beacon-blue hover:bg-blue-600 disabled:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload & Sync'}
            </button>
          </div>
        )}

        {/* Manual Tab */}
        {tab === 'manual' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Order ID</label>
              <input
                type="text"
                value={manualData.orderId}
                onChange={(e) =>
                  setManualData({ ...manualData, orderId: e.target.value })
                }
                placeholder="e.g., #12345"
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg focus:border-beacon-blue focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={manualData.trackingNumber}
                onChange={(e) =>
                  setManualData({ ...manualData, trackingNumber: e.target.value })
                }
                placeholder="e.g., 1Z999AA10123456784"
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg focus:border-beacon-blue focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Carrier (optional)
              </label>
              <input
                type="text"
                value={manualData.carrier}
                onChange={(e) =>
                  setManualData({ ...manualData, carrier: e.target.value })
                }
                placeholder="e.g., UPS, FedEx (auto-detected if left blank)"
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg focus:border-beacon-blue focus:outline-none"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleManualSync}
              disabled={!manualData.orderId || !manualData.trackingNumber || loading}
              className="w-full bg-beacon-blue hover:bg-blue-600 disabled:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Syncing...' : 'Create Sync'}
            </button>
          </div>
        )}
      </div>

      {/* Format Help */}
      <div className="bg-beacon-card border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">CSV Format</h3>
        <div className="bg-gray-800 rounded p-4 text-sm font-mono text-gray-300">
          <div>orderId,trackingNumber,carrier</div>
          <div>#12345,1Z999AA10123456784,UPS</div>
          <div>#12346,9400111899223456789012,USPS</div>
          <div>#12347,794618519287,FedEx</div>
        </div>
        <p className="text-gray-400 text-xs mt-4">
          💡 Carrier column is optional. If not provided, we'll auto-detect from the tracking number.
        </p>
      </div>
    </div>
  );
}
