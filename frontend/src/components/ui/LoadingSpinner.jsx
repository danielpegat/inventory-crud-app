/**
 * Loading Spinner Component
 * Used throughout the app for loading states.
 * Provides both a full-page spinner and inline variant.
 */

/** Full-page centered spinner */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-primary rounded-full animate-spin mb-4" />
      <p className="text-sm text-on-surface-variant">{message}</p>
    </div>
  );
}

/** Inline spinner for buttons */
export function InlineSpinner() {
  return (
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}
