/**
 * Product Form Page
 * Handles both creating and editing products.
 * Matches the Stitch "Edit Product" mockup with two-column form layout.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { InlineSpinner } from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import productService from '../services/productService';
import { formatDate } from '../utils/helpers';

export default function ProductFormPage() {
  const { id } = useParams();  // If present, we're editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    categoryId: '',
    price: '',
    quantity: '',
  });

  // UI state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing); // Only show loader when editing
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [productMeta, setProductMeta] = useState(null); // For audit metadata

  // Fetch categories and product data (if editing) on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch categories for the dropdown
        const catResponse = await productService.getCategories();
        setCategories(catResponse.data);

        // If editing, fetch the product
        if (isEditing) {
          const prodResponse = await productService.getById(id);
          const product = prodResponse.data;

          setFormData({
            name: product.name,
            sku: product.sku,
            description: product.description || '',
            categoryId: String(product.category_id),
            price: String(product.price),
            quantity: String(product.quantity),
          });

          setProductMeta({
            updatedAt: product.updated_at,
            createdBy: product.created_by_name,
          });
        }
      } catch (err) {
        setToast({
          message: err.response?.data?.message || 'Failed to load data',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  /**
   * Handle form field changes.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Client-side validation before submitting.
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = 'Valid price is required';
    if (formData.quantity === '' || parseInt(formData.quantity) < 0) newErrors.quantity = 'Valid quantity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      if (isEditing) {
        await productService.update(id, formData);
        setToast({ message: 'Product updated successfully!', type: 'success' });
      } else {
        await productService.create(formData);
        setToast({ message: 'Product created successfully!', type: 'success' });
      }

      // Navigate back to products list after a brief delay
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save product';
      // Handle validation errors from the API
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      }
      setToast({ message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Loading product data..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="p-12 max-w-5xl mx-auto w-full animate-fade-in">
        {/* Contextual Header */}
        <div className="mb-12 relative">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4 tracking-wide uppercase">
            <span className="material-symbols-outlined text-sm">
              {isEditing ? 'edit' : 'add_circle'}
            </span>
            Inventory Management
          </div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight -ml-0.5">
            {isEditing ? 'Edit Product Record' : 'Create New Product'}
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-xl leading-relaxed">
            {isEditing
              ? 'Modify product specifications and inventory levels. Changes are audited and synced across all regional distribution centers immediately upon saving.'
              : 'Add a new product to your inventory. Fill in the details below and click Save to create the record.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-8 lg:p-12 relative -mt-6 border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section: Basic Info / Identity */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Identity</h3>
                <p className="text-xs text-outline mt-1 leading-relaxed">
                  Visual and naming identifiers for customer-facing displays.
                </p>
              </div>
              <div className="md:col-span-8 space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-tighter mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input-fluid ${errors.name ? 'border-error focus:border-error focus:ring-error/5' : ''}`}
                    placeholder="e.g. Premium Suite V2"
                  />
                  {errors.name && (
                    <p className="text-[11px] text-error mt-2 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-tighter mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className={`form-input-fluid ${errors.sku ? 'border-error focus:border-error focus:ring-error/5' : ''}`}
                    placeholder="e.g. PSV-2001"
                  />
                  {errors.sku && (
                    <p className="text-[11px] text-error mt-2 font-medium">{errors.sku}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-tighter mb-2">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`form-input-fluid appearance-none ${errors.categoryId ? 'border-error focus:border-error focus:ring-error/5' : ''}`}
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-[11px] text-error mt-2 font-medium">{errors.categoryId}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-tighter mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="form-input-fluid resize-none"
                    placeholder="Brief product description..."
                  />
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-surface-container-high w-full" />

            {/* Section: Economics */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Economics</h3>
                <p className="text-xs text-outline mt-1 leading-relaxed">
                  Define the unit cost and available stock thresholds.
                </p>
              </div>
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-tighter mb-2">
                    Unit Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`form-input-fluid pl-8 ${errors.price ? 'border-error focus:border-error focus:ring-error/5' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-[11px] text-error mt-2 font-medium">{errors.price}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-tighter mb-2">
                    Quantity in Stock
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className={`form-input-fluid ${errors.quantity ? 'border-error focus:border-error focus:ring-error/5' : ''}`}
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="text-[11px] text-error mt-2 font-medium">{errors.quantity}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-4 pt-8 mt-4 border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 text-sm font-bold text-on-primary primary-gradient rounded-lg shadow-lg shadow-primary/20
                  hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <InlineSpinner />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Audit Metadata (only shown when editing) */}
        {isEditing && productMeta && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
            <div className="flex items-start gap-4 p-4">
              <span className="material-symbols-outlined text-outline">history</span>
              <div>
                <span className="block text-[10px] uppercase font-bold text-outline tracking-widest">Last Updated</span>
                <span className="text-xs font-medium text-on-surface">
                  {productMeta.updatedAt ? formatDate(productMeta.updatedAt) : 'N/A'}
                  {productMeta.createdBy ? ` by ${productMeta.createdBy}` : ''}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <span className="material-symbols-outlined text-outline">verified_user</span>
              <div>
                <span className="block text-[10px] uppercase font-bold text-outline tracking-widest">Audit Status</span>
                <span className="text-xs font-medium text-on-surface">Compliance Verified</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <span className="material-symbols-outlined text-outline">cloud_done</span>
              <div>
                <span className="block text-[10px] uppercase font-bold text-outline tracking-widest">Sync</span>
                <span className="text-xs font-medium text-on-surface">Local Changes Saved</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
