/**
 * Dashboard Layout Component
 * Wraps page content with the Sidebar + TopNav shell.
 * All authenticated pages render inside this layout.
 */
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function DashboardLayout({ children, searchValue, onSearchChange, searchPlaceholder }) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopNav
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
        />

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-10 py-8 text-center">
          <p className="text-xs text-on-surface-variant/40 uppercase tracking-[0.2em]">
            Fluid Architect © {new Date().getFullYear()} Management Suite
          </p>
        </footer>
      </div>
    </div>
  );
}
