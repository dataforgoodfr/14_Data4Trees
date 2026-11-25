/**
 * Read and parse a localStorage entry outside React.
 *
 * Returns `fallback` when the entry is missing, unparsable or storage is
 * unavailable (private mode, blocked site data), so callers never have to guard.
 */
export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

/**
 * Write a localStorage entry outside React, as JSON.
 *
 * Failures (quota, blocked site data) are logged and swallowed: the in-memory
 * state stays the source of truth for the session, only persistence is lost.
 */
export const writeStorage = <T>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};
