import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="page-title">Settings</h1>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" /> Account
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="text-sm font-medium text-gray-900">Name</p>
              <p className="text-sm text-gray-500">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Security
        </h2>
        <p className="text-sm text-gray-500 mb-4">Manage your account security settings.</p>
        <button onClick={handleLogout} className="btn-danger flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About CareerPathr</h2>
        <p className="text-sm text-gray-500">Version 1.0.0</p>
        <p className="text-sm text-gray-500">A career planning tool for students.</p>
      </div>
    </div>
  );
}
