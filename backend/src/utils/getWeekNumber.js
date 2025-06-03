/**
 * Calculates the week number for a given target date relative to a start date.
 * 
 * Example:
 * - If the start date is the start of a course or program, this function returns
 *   which week a target date falls into (1-based index).
 *
 * @param {string|Date} startDate - The start date (can be a Date object or a date string).
 * @param {string|Date} [targetDate=new Date()] - The target date (optional, defaults to today).
 * @returns {number} The week number (1-based).
 *
 * @example
 * const { getWeekNumber } = require('./getWeekNumber');
 * const week = getWeekNumber('2024-01-01', '2024-02-12'); // Returns 7
 */
function getWeekNumber(startDate, targetDate = new Date()){
    const start = new Date(startDate);
    const target = new Date(targetDate);
    
    start.setHours(0,0,0,0,);
    target.setHours(0,0,0,0,);

    const diffInDays = Math.floor((target - start)/ (1000 * 60 * 60 * 24));

    return Math.floor(diffInDays/7) + 1;
}

module.exports = {getWeekNumber};