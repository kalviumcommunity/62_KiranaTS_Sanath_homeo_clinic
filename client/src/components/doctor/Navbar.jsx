import { useNavigate } from 'react-router-dom';
import { Home, Stethoscope } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Doctor Portal
              </h1>
              <p className="text-xs text-gray-500">Manage your practice</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}