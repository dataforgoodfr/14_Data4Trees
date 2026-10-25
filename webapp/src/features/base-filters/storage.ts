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
