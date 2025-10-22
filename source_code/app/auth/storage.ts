// Lightweight storage adapter for Supabase Auth that lets us switch
// at runtime. This enables a "Remember me" checkbox that controls session scope.

const isBrowser = typeof window !== 'undefined'

type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

const memoryStorage = (() => {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => map.set(k, v),
    removeItem: (k: string) => map.delete(k)
  }
})()

const PERSIST_FLAG_KEY = 'hmdd:auth:persist' // '1' = persistent (localStorage), '0' = session

export function setAuthPersistence(remember: boolean) {
  if (!isBrowser) return
  try {
    // store preference in localStorage so it survives page reloads
    window.localStorage.setItem(PERSIST_FLAG_KEY, remember ? '1' : '0')
  } catch (e) {
    // ignore
  }
}

const adapter: StorageLike = {
  getItem(key) {
    if (!isBrowser) return memoryStorage.getItem(key)
    try {
      const flag = window.localStorage.getItem(PERSIST_FLAG_KEY)
      const backend = flag === '0' ? window.sessionStorage : window.localStorage
      return backend.getItem(key)
    } catch (e) {
      return memoryStorage.getItem(key)
    }
  },
  setItem(key, value) {
    if (!isBrowser) return memoryStorage.setItem(key, value)
    try {
      const flag = window.localStorage.getItem(PERSIST_FLAG_KEY)
      const backend = flag === '0' ? window.sessionStorage : window.localStorage
      backend.setItem(key, value)
    } catch (e) {
      memoryStorage.setItem(key, value)
    }
  },
  removeItem(key) {
    if (!isBrowser) return memoryStorage.removeItem(key)
    try {
      // remove from both storage backends to be safe
      window.sessionStorage.removeItem(key)
      window.localStorage.removeItem(key)
    } catch (e) {
      memoryStorage.removeItem(key)
    }
  }
}

export default adapter
