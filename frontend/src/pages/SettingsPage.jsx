/**
 * Settings Page
 * Placeholder settings page with profile info and app configuration.
 */
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/ui/Toast';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="p-12 max-w-4xl mx-auto w-full animate-fade-in">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Settings</h2>
          <p className="text-on-surface-variant">Manage your account preferences and application configuration.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 ghost-border mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6">Profile</h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">{user?.name}</p>
              <p className="text-sm text-on-surface-variant">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary-fixed text-on-primary-fixed-variant">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* App Config Section */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 ghost-border mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6">Application</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-surface-container">
              <div>
                <p className="font-medium text-on-surface">Email Notifications</p>
                <p className="text-xs text-on-surface-variant">Receive alerts for low stock items</p>
              </div>
              <button
                className="w-12 h-7 bg-primary rounded-full relative transition-colors"
                onClick={() => setToast({ message: 'Settings saved!', type: 'success' })}
              >
                <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1 shadow-sm transition-all" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-surface-container">
              <div>
                <p className="font-medium text-on-surface">Dark Mode</p>
                <p className="text-xs text-on-surface-variant">Switch to dark theme</p>
              </div>
              <button
                className="w-12 h-7 bg-surface-container-high rounded-full relative transition-colors"
                onClick={() => setToast({ message: 'Dark mode coming soon!', type: 'info' })}
              >
                <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 shadow-sm transition-all" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-on-surface">API Version</p>
                <p className="text-xs text-on-surface-variant">Current API version</p>
              </div>
              <span className="text-sm font-mono text-on-surface-variant">v2.4.0</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 border border-error/20">
          <h3 className="text-sm font-bold uppercase tracking-wider text-error mb-6">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">Delete Account</p>
              <p className="text-xs text-on-surface-variant">Permanently delete your account and all associated data</p>
            </div>
            <button
              className="px-4 py-2 text-sm font-semibold text-error border border-error/30 rounded-lg hover:bg-error-container transition-colors"
              onClick={() => setToast({ message: 'Please contact support to delete your account.', type: 'info' })}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
