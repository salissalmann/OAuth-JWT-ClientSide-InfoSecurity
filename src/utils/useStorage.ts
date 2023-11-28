// storageUtils.ts

interface StorageUtils {
  setItem(
    key: string,
    value: string | object | number | string[] | number[] | object[],
    type?: "local" | "session"
  ): void;
  getItem<T>(key: string, type?: "local" | "session"): T | null;
  removeItem(key: string, type?: "local" | "session"): void;
}

const storage: StorageUtils = {
  setItem: (key, value, type = "local") => {
    const serializedValue = JSON.stringify(value);
    if (type === "local") {
      localStorage.setItem(key, serializedValue);
    } else {
      sessionStorage.setItem(key, serializedValue);
    }
  },
  getItem: (key, type = "local") => {
    if (type == "local") {
      const localStorageItem = localStorage.getItem(key);
      return localStorageItem ? JSON.parse(localStorageItem) : null;
    } else {
      const sessionStorageItem = sessionStorage.getItem(key);
      return sessionStorageItem ? JSON.parse(sessionStorageItem) : null;
    }
  },
  removeItem: (key, type = "local") => {
    if (type == "local") {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  },
};

export default storage;
