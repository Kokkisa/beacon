import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-beacon-dark">
      {/* Navbar */}
      <nav className="bg-beacon-card border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔦</span>
              <span className="text-white font-bold">Beacon</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-beacon-card border-r border-gray-700">
          <nav className="p-4 space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/syncs"
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              🔄 Syncs
            </Link>
            <Link
              to="/integrations"
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              🔗 Integrations
            </Link>
            <a
              href="#"
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              📈 Analytics
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              ⚙️ Settings
            </a>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-400 mb-8">Illuminate your fulfillment workflow</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Syncs', value: '0', icon: '🔄' },
                { label: 'Success Rate', value: '—', icon: '✓' },
                { label: 'Orders Fulfilled', value: '0', icon: '📦' },
                { label: 'Active Integrations', value: '0', icon: '🔗' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-beacon-card border border-gray-700 rounded-lg p-6 hover:border-beacon-amber transition-colors"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                  <div className="text-2xl font-bold text-white mt-2">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-beacon-card border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Quick Start</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-beacon-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  + New Sync
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Connect Integration
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-beacon-card border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Syncs</h2>
              <p className="text-gray-400 text-center py-8">No syncs yet. Create your first sync to get started!</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
