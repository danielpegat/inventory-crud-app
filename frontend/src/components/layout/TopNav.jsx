/**
 * TopNav Component
 * Sticky top bar with search, notifications, and user profile.
 * Matches the glass-effect header from the Stitch mockup.
 */
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function TopNav({ searchValue, onSearchChange, searchPlaceholder }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-8 py-4">
      {/* Left: Brand + Search */}
      <div className="flex items-center gap-6 flex-1">
        <span className="text-lg font-black tracking-tight text-slate-900">Fluid Architect</span>

        {/* Search Bar — if search handler is provided */}
        {onSearchChange && (
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>
            <input
              type="text"
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm
                focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder={searchPlaceholder || 'Search records, products, or settings...'}
              id="global-search"
            />
          </div>
        )}
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-indigo-600 opacity-80 hover:opacity-100 transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-slate-500 hover:text-indigo-600 opacity-80 hover:opacity-100 transition-all">
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              {user?.role || 'user'}
            </p>
          </div>
          {/* Avatar with initials fallback */}
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  );
}
