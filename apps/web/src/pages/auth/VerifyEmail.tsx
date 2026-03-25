import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error?.message || 'Verification failed. Link may have expired.');
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-beacon-dark mb-8">🔦 Beacon</h1>

        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beacon-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✓</div>
            <p className="text-green-600 font-medium mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-beacon-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">✗</div>
            <p className="text-red-600 font-medium mb-6">{message}</p>
            <div className="space-y-2">
              <Link
                to="/register"
                className="inline-block bg-beacon-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Try Signing Up Again
              </Link>
              <p className="text-gray-500 text-sm">
                or{' '}
                <Link to="/login" className="text-beacon-blue hover:underline">
                  log in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
