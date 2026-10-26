/**
 * Utility functions for date formatting and comparisons
 */

/**
 * Format a date string to display format (dd/MM/yyyy or HH:mm, dd/MM/yyyy)
 * @param {string|Date} dateInput
 * @param {string} [type='full'] 'date' | 'time' | 'full'
 * @returns {string}
 */
export function formatDate(dateInput, type = 'full') {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (type === 'date') {
    return `${day}/${month}/${year}`;
  }
  if (type === 'time') {
    return `${hours}:${minutes}`;
  }
  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

/**
 * Checks if a due date is in the past compared to current time
 * @param {string} dueDate
 * @returns {boolean}
 */
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const due = new Date(dueDate).getTime();
  return due < Date.now();
}

/**
 * Calculates number of days left until dueDate
 * @param {string} dueDate
 * @returns {number}
 */
export function daysLeft(dueDate) {
  if (!dueDate) return 0;
  const diffMs = new Date(dueDate).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a dueDate is upcoming within the next 7 days
 * @param {string} dueDate
 * @returns {boolean}
 */
export function isWithin7Days(dueDate) {
  if (!dueDate) return false;
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const sevenDaysLater = now + 7 * 24 * 60 * 60 * 1000;
  return due >= now && due <= sevenDaysLater;
}
