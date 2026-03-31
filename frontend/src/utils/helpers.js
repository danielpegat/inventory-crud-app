/**
 * Utility Helpers
 * Shared formatting and validation functions.
 */

/**
 * Format a number as USD currency.
 * @param {number} amount - Dollar amount
 * @returns {string} Formatted string like "$12,500.00"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format a number with commas.
 * @param {number} num - Any number
 * @returns {string} Formatted string like "1,284"
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format an ISO date string to a readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted string like "Oct 24, 2023"
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get relative time string (e.g., "2 hours ago").
 * Used in the activity feed.
 * @param {string} dateStr - ISO date string
 * @returns {string} Relative time string
 */
export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

/**
 * Get the stock status label and color configuration.
 * Maps the database status ENUM to display values.
 */
export function getStockStatus(status, quantity) {
  switch (status) {
    case 'in_stock':
      return { label: `In Stock (${quantity})`, color: 'bg-tertiary', dotColor: 'bg-tertiary' };
    case 'low_stock':
      return { label: `Low Stock (${quantity})`, color: 'bg-error', dotColor: 'bg-error' };
    case 'out_of_stock':
      return { label: 'Out of Stock', color: 'bg-on-surface-variant', dotColor: 'bg-on-surface-variant' };
    default:
      return { label: 'Unknown', color: 'bg-outline', dotColor: 'bg-outline' };
  }
}

/**
 * Get the category badge color classes.
 * Maps the category color key to TailwindCSS classes.
 */
export function getCategoryBadge(color) {
  const badges = {
    primary: 'bg-primary-fixed text-on-primary-fixed-variant',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  };
  return badges[color] || badges.primary;
}

/**
 * Generate initials from a name (for avatar fallbacks).
 * @param {string} name - Full name
 * @returns {string} Two-letter initials like "AR"
 */
export function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
