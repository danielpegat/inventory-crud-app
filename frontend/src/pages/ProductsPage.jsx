/**
 * Products Page
 * Full products table with search, filter, pagination, and CRUD actions.
 * Matches the Stitch "Products & Records Table" mockup.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import useProducts from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getStockStatus, getCategoryBadge, formatNumber } from '../utils/helpers';

export default function ProductsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // Products hook manages all data, filters, and pagination state
  const {
    products, categories, pagination,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    loading, error,
    goToPage, deleteProduct, refresh,
  } = useProducts();

  // UI state for delete confirmation
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  /**
   * Handle delete confirmation.
   */
  const handleDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);

    const result = await deleteProduct(deleteModal.product.id);

    if (result.success) {
      setToast({ message: 'Product deleted successfully', type: 'success' });
    } else {
      setToast({ message: result.message, type: 'error' });
    }

    setDeleteModal({ open: false, product: null });
    setDeleting(false);
  };

  return (
    <DashboardLayout
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search products by name or SKU..."
    >
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
      >
        <p className="text-on-surface-variant mb-6">
          Are you sure you want to delete{' '}
          <span className="font-bold text-on-surface">{deleteModal.product?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteModal({ open: false, product: null })}
            className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm font-bold text-on-error bg-error rounded-lg hover:bg-error/90 transition-colors disabled:opacity-70"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

      <div className="p-10 max-w-7xl mx-auto w-full animate-fade-in">
        {/* Page Header */}
        <div className="mb-12 flex justify-between items-end relative">
          <div className="z-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
              Product Inventory
            </h2>
            <p className="text-on-surface-variant text-lg max-w-md">
              Manage your product catalog, update stock levels, and review record history in real-time.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate('/products/new')}
              className="flex items-center gap-2 px-6 py-3 primary-gradient text-on-primary rounded-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-6 rounded-xl ghost-border shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
              Total Products
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-on-surface">{formatNumber(pagination.total)}</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-6 rounded-xl ghost-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Filters
              </p>
              <div className="flex gap-4">
                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refresh}
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                title="Refresh"
              >
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden ghost-border">
          <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center">
            <h3 className="font-bold text-on-surface">All Products</h3>
            <div className="flex gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading products..." />
          ) : error ? (
            <div className="p-8 text-center text-error">
              <span className="material-symbols-outlined text-3xl mb-2">error</span>
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">inventory_2</span>
              <p className="text-on-surface-variant text-lg font-medium">No products found</p>
              <p className="text-outline text-sm mt-1">
                {search ? 'Try adjusting your search or filters.' : 'Create your first product to get started.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Product Name
                    </th>
                    <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Category
                    </th>
                    <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Price
                    </th>
                    <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Stock Level
                    </th>
                    <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Date Modified
                    </th>
                    {isAdmin && (
                      <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant text-right">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockInfo = getStockStatus(product.status, product.quantity);
                    const badgeClass = getCategoryBadge(product.category_color);

                    // Pick icon per category
                    const iconMap = {
                      architecture: 'architecture',
                      industrial: 'precision_manufacturing',
                      electronics: 'memory',
                      software: 'code',
                      services: 'support_agent',
                    };
                    const icon = iconMap[product.category_slug] || 'inventory_2';

                    // Pick icon color class per category
                    const iconColorMap = {
                      primary: 'bg-primary/5 text-primary',
                      secondary: 'bg-secondary/5 text-secondary',
                      tertiary: 'bg-tertiary/5 text-tertiary',
                    };
                    const iconColor = iconColorMap[product.category_color] || iconColorMap.primary;

                    return (
                      <tr key={product.id} className="table-row-hover group border-t border-surface-container-low/50">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
                              <span className="material-symbols-outlined">{icon}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface">{product.name}</p>
                              <p className="text-xs text-on-surface-variant">SKU: {product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`status-badge ${badgeClass}`}>
                            {product.category_name}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm font-semibold text-on-surface">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${stockInfo.dotColor}`} />
                            <span className="text-sm font-medium">{stockInfo.label}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-on-surface-variant">
                          {formatDate(product.updated_at)}
                        </td>
                        {isAdmin && (
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => navigate(`/products/edit/${product.id}`)}
                                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                                title="Edit product"
                              >
                                <span className="material-symbols-outlined text-xl">edit</span>
                              </button>
                              <button
                                onClick={() => setDeleteModal({ open: true, product })}
                                className="p-2 text-on-surface-variant hover:text-error transition-colors"
                                title="Delete product"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && products.length > 0 && (
            <Pagination pagination={pagination} onPageChange={goToPage} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
