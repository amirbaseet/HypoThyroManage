/**
 * Week Utilities
 * 
 * Provides helper functions for calculating date ranges for weeks.
 */

/**
 * Get the start and end dates for the current week.
 * 
 * - The week starts on Monday and ends on Sunday.
 * - Returns both start and end as JavaScript Date objects.
 * 
 * @returns {Object} An object containing:
 *   - {Date} weekStart: Start of the current week (Monday, 00:00:00.000)
 *   - {Date} weekEnd: End of the current week (Sunday, 23:59:59.999)
 * 
 * @example
 * const { getCurrentWeek } = require('./weekUtils');
 * const { weekStart, weekEnd } = getCurrentWeek();
 * console.log(weekStart); // e.g., Mon Mar 25 2024 00:00:00
 * console.log(weekEnd);   // e.g., Sun Mar 31 2024 23:59:59.999
 */
function getCurrentWeek() {
    let today = new Date();
    
    let startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { weekStart: startOfWeek, weekEnd: endOfWeek };
}

module.exports = { getCurrentWeek };
