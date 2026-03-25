import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

// App pages
import Dashboard from './pages/dashboard/Dashboard';
import Integrations from './pages/integrations/Integrations';
import Syncs from './pages/syncs/Syncs';
import NewSync from './pages/syncs/NewSync';

// Landing page
function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-beacon-dark mb-4">🔦 Beacon</h1>
        <p className="text-xl text-gray-600 mb-8">Fulfillment automation for e-commerce</p>
        <div className="space-x-4">
          <a href="/login" className="inline-block bg-beacon-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Sign In
          </a>
          <a href="/register" className="inline-block bg-white text-beacon-blue px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-beacon-blue">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/integrations"
          element={
            <ProtectedRoute>
              <Integrations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/syncs"
          element={
            <ProtectedRoute>
              <Syncs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/syncs/new"
          element={
            <ProtectedRoute>
              <NewSync />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
