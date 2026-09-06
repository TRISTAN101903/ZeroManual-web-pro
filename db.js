/* ============================================================
   ZeroManual — local database layer
   ------------------------------------------------------------
   This is a real, working database (IndexedDB) that runs inside
   each visitor's own browser. It is NOT a shared server database:
   nothing here is visible across visitors or devices, because this
   site is a static page with no backend.

   What it's good for right now:
     - Persisting contact-form submissions on the visitor's device
       (so a message survives a refresh, and you can wire up an
       actual mailto send from it).
     - Local counters (e.g. "download" clicks on this browser).

   If you later want a real shared database (e.g. contact messages
   that land in your inbox automatically, or a global download
   counter across all visitors), swap the calls in `saveMessage`
   and `bumpStat` for calls to a backend of your choice
   (Firebase, Supabase, a small serverless function, etc). Every
   function below returns a Promise, so the rest of the site does
   not need to change.
   ============================================================ */
(function (global) {
  const DB_NAME = 'zeromanual_db';
  const DB_VERSION = 1;
  const STORE_MESSAGES = 'messages';
  const STORE_STATS = 'stats';

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
          db.createObjectStore(STORE_MESSAGES, { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(STORE_STATS)) {
          db.createObjectStore(STORE_STATS, { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  // ---- localStorage fallback (older browsers / privacy modes) ----
  function lsSaveMessage(msg) {
    const key = 'zm_messages';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(msg);
    localStorage.setItem(key, JSON.stringify(list));
    return Promise.resolve(msg);
  }
  function lsGetMessages() {
    return Promise.resolve(JSON.parse(localStorage.getItem('zm_messages') || '[]'));
  }
  function lsBumpStat(key) {
    const k = 'zm_stat_' + key;
    const val = (parseInt(localStorage.getItem(k) || '0', 10)) + 1;
    localStorage.setItem(k, String(val));
    return Promise.resolve(val);
  }
  function lsGetStat(key) {
    return Promise.resolve(parseInt(localStorage.getItem('zm_stat_' + key) || '0', 10));
  }

  const ZMDB = {
    async saveMessage(message) {
      const record = { ...message, createdAt: new Date().toISOString() };
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_MESSAGES, 'readwrite');
          tx.objectStore(STORE_MESSAGES).add(record);
          tx.oncomplete = () => resolve(record);
          tx.onerror = () => reject(tx.error);
        });
      } catch (e) {
        return lsSaveMessage(record);
      }
    },

    async getMessages() {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_MESSAGES, 'readonly');
          const req = tx.objectStore(STORE_MESSAGES).getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
      } catch (e) {
        return lsGetMessages();
      }
    },

    async bumpStat(key) {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_STATS, 'readwrite');
          const store = tx.objectStore(STORE_STATS);
          const getReq = store.get(key);
          getReq.onsuccess = () => {
            const current = getReq.result ? getReq.result.value : 0;
            const next = current + 1;
            store.put({ key, value: next });
            tx.oncomplete = () => resolve(next);
          };
          getReq.onerror = () => reject(getReq.error);
        });
      } catch (e) {
        return lsBumpStat(key);
      }
    },

    async getStat(key) {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_STATS, 'readonly');
          const req = tx.objectStore(STORE_STATS).get(key);
          req.onsuccess = () => resolve(req.result ? req.result.value : 0);
          req.onerror = () => reject(req.error);
        });
      } catch (e) {
        return lsGetStat(key);
      }
    }
  };

  global.ZMDB = ZMDB;
})(window);
