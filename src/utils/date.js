// utils/date.js
import { format } from "date-fns";

export const getWeekday = (dateStr) => {
    return format(new Date(dateStr), "EEE"); // e.g., "Mon", "Tue"
};

export const getFormattedDate = (dateStr) => {
    return format(new Date(dateStr), "dd MMM");
};
