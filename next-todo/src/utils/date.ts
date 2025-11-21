/**
 * Converts a timestamp to an HTML date input format (YYYY-MM-DD)
 */
export const timestampToDateString = (timestamp: number | null): string => {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};

/**
 * Converts an HTML date input string (YYYY-MM-DD) to a timestamp
 */
export const dateStringToTimestamp = (dateString: string): number | null => {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString + "T00:00:00");
  return date.getTime();
};

/**
 * Gets the timestamp for the end of today (23:59:59)
 */
export const getEndOfToday = (): number => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.getTime();
};

/**
 * Gets today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};


