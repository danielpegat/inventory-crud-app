/**
 * Login Page
 * Faithfully reproduces the Stitch mockup login design.
 * Features: glassmorphic card, gradient background blobs,
 * social login divider, "Stay signed in" checkbox.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { InlineSpinner } from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setToast({ message: result.message, type: 'error' });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="w-full max-w-auto flex flex-col items-center animate-fade-in">
        {/* Brand Identity */}
        <div className="mb-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined text-white text-3xl">architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Fluid Architect</h1>
          <p className="text-on-surface-variant text-sm mt-1">SaaS Management Suite</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl p-10 card-shadow ghost-border relative">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-surface mb-2">Welcome back</h2>
            <p className="text-on-surface-variant text-sm">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                className="w-full px-4 py-3 bg-surface-container-lowest ghost-border rounded-lg text-sm text-on-surface
                  placeholder:text-outline/50 focus:outline-none focus:ring-4 focus:ring-primary/10
                  focus:border-primary transition-all duration-200"
                placeholder="name@company.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:text-primary-container transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className="w-full px-4 py-3 bg-surface-container-lowest ghost-border rounded-lg text-sm text-on-surface
                  placeholder:text-outline/50 focus:outline-none focus:ring-4 focus:ring-primary/10
                  focus:border-primary transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 px-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
              />
              <label htmlFor="remember" className="text-sm text-on-surface-variant cursor-pointer">
                Stay signed in for 30 days
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-error-container rounded-lg text-on-error-container text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">warning</span>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 primary-gradient text-white font-semibold rounded-lg shadow-sm
                hover:shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <InlineSpinner />
              ) : (
                <>
                  <span>Login</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-container-high" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface-container-lowest px-4 text-on-surface-variant">
                Or continue with
              </span>
            </div>
          </div>

          {/* Alternative Login Buttons (visual only) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center gap-2 py-2.5 bg-surface-container-lowest ghost-border
                rounded-lg hover:bg-surface-container-low transition-colors duration-200 text-sm font-medium"
              onClick={() => setToast({ message: 'Google login coming soon!', type: 'info' })}
            >
              <span className="material-symbols-outlined text-lg">g_translate</span>
              <span>Google</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2.5 bg-surface-container-lowest ghost-border
                rounded-lg hover:bg-surface-container-low transition-colors duration-200 text-sm font-medium"
              onClick={() => setToast({ message: 'Passkey login coming soon!', type: 'info' })}
            >
              <span className="material-symbols-outlined text-lg">passkey</span>
              <span>Passkey</span>
            </button>
          </div>
        </div>

        {/* Footer Help Link */}
        <p className="mt-8 text-on-surface-variant text-sm">
          Don't have an account?{' '}
          <a href="#" className="text-primary font-semibold hover:underline" onClick={(e) => e.preventDefault()}>
            Start your free trial
          </a>
        </p>

        {/* Decorative Background Blobs */}
        <div className="fixed top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none -z-10 bg-gradient-to-l from-primary-fixed to-transparent" />
        <div className="fixed bottom-0 left-0 w-1/4 h-1/2 opacity-5 pointer-events-none -z-10 bg-gradient-to-tr from-secondary-fixed to-transparent" />

        {/* Status Bar */}
        <div className="fixed bottom-8 text-[10px] font-mono tracking-tighter text-outline uppercase opacity-40">
          System Status: Operational • v2.4.0
        </div>
      </main>

      {/* Decorative Circle Blurs */}
      <div className="hidden lg:block fixed -bottom-20 -right-20 w-80 h-80 rounded-full blur-[120px] bg-primary/20 pointer-events-none" />
      <div className="hidden lg:block fixed -top-20 -left-20 w-80 h-80 rounded-full blur-[120px] bg-secondary/10 pointer-events-none" />
    </div>
  );
}
