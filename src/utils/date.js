import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import i18n from "../i18n";

/**
 * Returns correct date-fns locale object based on current app language
 */
export const getLocale = () => {
  const lng = i18n.language;
  if (lng === "en") return enUS;
  return tr;
};

export const getWeekday = (dateStr) => {
  return format(new Date(dateStr), "EEEE", { locale: getLocale() }); // "Pazartesi" or "Monday"
};

export const getFormattedDate = (dateStr) => {
  return format(new Date(dateStr), "dd MMMM", { locale: getLocale() }); // "28 Mart" or "28 March"
};
