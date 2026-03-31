/**
 * Dashboard Page
 * Main overview page with bento-grid stats, recent records table,
 * and activity feed. Matches the Stitch "Dashboard Home" mockup.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import { formatCurrency, formatNumber, formatDate, timeAgo, getInitials } from '../utils/helpers';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data on mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await productService.getAnalytics();
        setAnalytics(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  /**
   * Map activity log action to icon and color.
   */
  const getActivityIcon = (action) => {
    const config = {
      create: { icon: 'add_circle', color: 'bg-tertiary/10 text-tertiary' },
      update: { icon: 'system_update_alt', color: 'bg-primary/10 text-primary' },
      delete: { icon: 'delete', color: 'bg-error/10 text-error' },
      login: { icon: 'person', color: 'bg-secondary/10 text-secondary' },
    };
    return config[action] || config.create;
  };

  /**
   * Format activity action into readable sentence.
   */
  const getActivityText = (activity) => {
    const details = activity.details ? JSON.parse(activity.details) : {};
    switch (activity.action) {
      case 'create':
        return (<><span className="font-bold">Created</span> {details.name || activity.entity_type} ({details.sku || ''})</>);
      case 'update':
        return (<><span className="font-bold">Updated</span> {details.name || activity.entity_type}</>);
      case 'delete':
        return (<><span className="font-bold">Deleted</span> {details.name || activity.entity_type}</>);
      case 'login':
        return (<><span className="font-bold">{activity.user_name}</span> logged in</>);
      default:
        return (<><span className="font-bold">{activity.action}</span> on {activity.entity_type}</>);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-end justify-between -mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">
              Overview
            </p>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Dashboard</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/15 text-on-surface font-medium rounded-lg text-sm hover:bg-surface-container-low transition-colors duration-200">
              Export Report
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/products/new')}
                className="px-4 py-2 primary-gradient text-white font-semibold rounded-lg text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95"
              >
                New Record
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading dashboard data..." />
        ) : error ? (
          <div className="p-6 bg-error-container rounded-xl text-on-error-container text-center">
            <span className="material-symbols-outlined text-2xl mb-2">error</span>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Card 1: Total Value */}
              <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">payments</span>
                  </div>
                  <span className="text-tertiary text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    Active
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Total Inventory Value</p>
                <h3 className="text-2xl font-black text-on-surface mt-1">
                  {formatCurrency(analytics?.totalValue || 0)}
                </h3>
                {/* Sparkline bars */}
                <div className="mt-4 h-12 w-full flex items-end gap-1">
                  {[40, 60, 45, 80, 55, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      className={`sparkline-bar ${i === 6 ? 'bg-primary' : 'bg-primary/20'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Stat Card 2: Active Products */}
              <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <span className="material-symbols-outlined text-secondary">inventory_2</span>
                  </div>
                  <span className="text-on-surface-variant text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">horizontal_rule</span>
                    Stable
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Active Products</p>
                <h3 className="text-2xl font-black text-on-surface mt-1">
                  {formatNumber(analytics?.totalProducts || 0)}
                </h3>
                <div className="mt-4 h-12 w-full flex items-end gap-1">
                  {[70, 70, 72, 68, 70, 70, 71].map((h, i) => (
                    <div
                      key={i}
                      className={`sparkline-bar ${i === 4 ? 'bg-secondary' : 'bg-secondary/20'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Stat Card 3: Low Stock Alerts */}
              <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-tertiary/10 rounded-lg">
                    <span className="material-symbols-outlined text-tertiary">warning</span>
                  </div>
                  {analytics?.lowStockCount > 0 && (
                    <span className="text-error text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">priority_high</span>
                      Attention
                    </span>
                  )}
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Low / Out of Stock</p>
                <h3 className="text-2xl font-black text-on-surface mt-1">
                  {analytics?.lowStockCount || 0}
                </h3>
                <div className="mt-4 h-12 w-full flex items-end gap-1">
                  {[30, 45, 40, 60, 75, 85, 80].map((h, i) => (
                    <div
                      key={i}
                      className={`sparkline-bar ${i === 5 ? 'bg-tertiary' : 'bg-tertiary/20'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Asymmetric Layout: Recent Records + Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Records Table — 2/3 width */}
              <section className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-lg font-bold text-on-surface">Category Breakdown</h4>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    View All Products
                  </button>
                </div>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/50">
                        <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant tracking-widest uppercase">
                          Category
                        </th>
                        <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant tracking-widest uppercase">
                          Products
                        </th>
                        <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant tracking-widest uppercase text-right">
                          Distribution
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {analytics?.categoryBreakdown?.map((cat, idx) => (
                        <tr key={idx} className="table-row-hover group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                {cat.name.slice(0, 2).toUpperCase()}
                              </div>
                              <p className="text-sm font-bold text-on-surface">{cat.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-on-surface">
                            {cat.count} items
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <div className="w-24 h-2 bg-surface-container-low rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    cat.color === 'primary' ? 'bg-primary' :
                                    cat.color === 'secondary' ? 'bg-secondary' : 'bg-tertiary'
                                  }`}
                                  style={{
                                    width: `${analytics.totalProducts > 0 ? (cat.count / analytics.totalProducts) * 100 : 0}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm text-on-surface-variant font-medium w-10 text-right">
                                {analytics.totalProducts > 0
                                  ? Math.round((cat.count / analytics.totalProducts) * 100)
                                  : 0}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Activity Feed — 1/3 width */}
              <section className="space-y-4">
                <h4 className="text-lg font-bold text-on-surface px-2">Recent Activity</h4>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/5">
                  <ul className="space-y-6">
                    {analytics?.recentActivity?.slice(0, 5).map((activity, idx) => {
                      const { icon, color } = getActivityIcon(activity.action);
                      return (
                        <li key={activity.id || idx} className="flex gap-4">
                          <div className="relative">
                            <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
                              <span className="material-symbols-outlined text-lg">{icon}</span>
                            </div>
                            {idx < (analytics.recentActivity.length - 1) && idx < 4 && (
                              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-surface-container" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-on-surface">
                              {getActivityText(activity)}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-1">
                              {timeAgo(activity.created_at)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Upgrade CTA Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-xl text-white shadow-xl shadow-indigo-900/10">
                  <h5 className="font-bold text-lg mb-2">Architect Pro</h5>
                  <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                    Upgrade to unlock advanced analytics and multi-user collaboration tools.
                  </p>
                  <button className="w-full bg-white text-indigo-700 font-bold py-2 rounded-lg text-sm transition-transform active:scale-95">
                    Upgrade Now
                  </button>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
