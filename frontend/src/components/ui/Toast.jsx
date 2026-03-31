/**
 * Toast Component
 * Displays success/error/info notifications.
 * Auto-dismisses after a configurable duration.
 */
import { useState, useEffect } from 'react';

/**
 * Toast notification component.
 * @param {Object} props
 * @param {string} props.message - Toast message text
 * @param {'success'|'error'|'info'} props.type - Toast type for styling
 * @param {Function} props.onClose - Callback when toast is dismissed
 * @param {number} props.duration - Auto-dismiss duration in ms (default: 4000)
 */
export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Style config based on type
  const styles = {
    success: {
      bg: 'bg-tertiary',
      icon: 'check_circle',
    },
    error: {
      bg: 'bg-error',
      icon: 'error',
    },
    info: {
      bg: 'bg-primary',
      icon: 'info',
    },
  };

  const { bg, icon } = styles[type] || styles.info;

  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-lg text-white shadow-xl
        ${bg} transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
