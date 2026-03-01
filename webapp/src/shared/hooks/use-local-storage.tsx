import { useState } from "react";

type SetValue<T> = T | ((val: T) => T);

/**
 * Hook to manage a value in localStorage.
 * It returns the current value and a function to update it.
 * The value is stored as JSON in localStorage.
 *
 * Example usage:
 * ```
 * const [name, setName] = useLocalStorage('user-name', 'Anonymous');
 * ```
 *
 * ```
 * const [settings, setSettings] = useLocalStorage<UserSettings>('user-settings', {
 *   theme: 'light',
 *   notifications: true
 * });
 * ```
 *
 * @link https://www.usehooks.io/docs/use-local-storage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: SetValue<T>) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
