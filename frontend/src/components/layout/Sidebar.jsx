/**
 * Sidebar Component
 * Fixed left navigation matching the Stitch mockup design.
 * Highlights the active route and shows user role-appropriate links.
 */
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Navigation items configuration.
   * Each item has an icon (Material Symbols name), label, and route path.
   */
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/' },
    { icon: 'inventory_2', label: 'Products / Records', path: '/products' },
    // Only show "Add New" link for admin users
    ...(user?.role === 'admin'
      ? [{ icon: 'add_circle', label: 'Add New', path: '/products/new' }]
      : []),
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 flex flex-col p-4 z-50 overflow-y-auto">
      {/* Brand */}
      <div className="mb-8 px-4 py-2">
        <h1 className="text-xl font-bold text-slate-900">Fluid Admin</h1>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
          Management Suite
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="mt-auto pt-4 border-t border-slate-200 space-y-1">
        <a
          href="#"
          className="nav-link"
          onClick={(e) => e.preventDefault()}
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-sm">Support</span>
        </a>
        <button onClick={handleLogout} className="nav-link w-full">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
