/**
 * IndexedDB Database Service for storing goals, targets, and device settings
 */

const DB_NAME = 'EcoarEnergyDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  GOALS: 'goals',
  TARGETS: 'targets',
  SETTINGS: 'settings',
  DEVICE_META: 'device_meta'
};

let db = null;

/**
 * Initialize the database
 * @returns {Promise<IDBDatabase>}
 */
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Create Goals store
      if (!database.objectStoreNames.contains(STORES.GOALS)) {
        const goalsStore = database.createObjectStore(STORES.GOALS, { keyPath: 'id', autoIncrement: true });
        goalsStore.createIndex('deviceId', 'deviceId', { unique: false });
        goalsStore.createIndex('period', 'period', { unique: false });
      }

      // Create Targets store
      if (!database.objectStoreNames.contains(STORES.TARGETS)) {
        const targetsStore = database.createObjectStore(STORES.TARGETS, { keyPath: 'id', autoIncrement: true });
        targetsStore.createIndex('deviceId', 'deviceId', { unique: false });
        targetsStore.createIndex('type', 'type', { unique: false });
      }

      // Create Settings store
      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        const settingsStore = database.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }

      // Create Device Meta store
      if (!database.objectStoreNames.contains(STORES.DEVICE_META)) {
        const deviceMetaStore = database.createObjectStore(STORES.DEVICE_META, { keyPath: 'id', autoIncrement: true });
        deviceMetaStore.createIndex('deviceId', 'deviceId', { unique: false });
        deviceMetaStore.createIndex('metaType', 'metaType', { unique: false });
      }
    };
  });
};

/**
 * Add a goal to the database
 * @param {Object} goal - Goal object { deviceId, period, value, description, createdAt }
 * @returns {Promise<number>} ID of created goal
 */
export const addGoal = async (goal) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.GOALS], 'readwrite');
    const store = transaction.objectStore(STORES.GOALS);
    const request = store.add({
      ...goal,
      createdAt: new Date().toISOString()
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get goals for a specific device
 * @param {number} deviceId
 * @returns {Promise<Array>}
 */
export const getGoalsByDevice = async (deviceId) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.GOALS], 'readonly');
    const store = transaction.objectStore(STORES.GOALS);
    const index = store.index('deviceId');
    const request = index.getAll(deviceId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Update a goal
 * @param {number} id - Goal ID
 * @param {Object} updates - Updated goal data
 * @returns {Promise<void>}
 */
export const updateGoal = async (id, updates) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.GOALS], 'readwrite');
    const store = transaction.objectStore(STORES.GOALS);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const goal = getRequest.result;
      if (!goal) {
        reject(new Error('Goal not found'));
        return;
      }

      const updateRequest = store.put({
        ...goal,
        ...updates,
        updatedAt: new Date().toISOString()
      });

      updateRequest.onerror = () => reject(updateRequest.error);
      updateRequest.onsuccess = () => resolve();
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Delete a goal
 * @param {number} id - Goal ID
 * @returns {Promise<void>}
 */
export const deleteGoal = async (id) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.GOALS], 'readwrite');
    const store = transaction.objectStore(STORES.GOALS);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

/**
 * Add a target
 * @param {Object} target - Target object { deviceId, type, value, period }
 * @returns {Promise<number>}
 */
export const addTarget = async (target) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.TARGETS], 'readwrite');
    const store = transaction.objectStore(STORES.TARGETS);
    const request = store.add({
      ...target,
      createdAt: new Date().toISOString()
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get targets for a device
 * @param {number} deviceId
 * @returns {Promise<Array>}
 */
export const getTargetsByDevice = async (deviceId) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.TARGETS], 'readonly');
    const store = transaction.objectStore(STORES.TARGETS);
    const index = store.index('deviceId');
    const request = index.getAll(deviceId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Save a setting
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export const saveSetting = async (key, value) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SETTINGS], 'readwrite');
    const store = transaction.objectStore(STORES.SETTINGS);
    const request = store.put({ key, value });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

/**
 * Get a setting
 * @param {string} key
 * @returns {Promise<any>}
 */
export const getSetting = async (key) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SETTINGS], 'readonly');
    const store = transaction.objectStore(STORES.SETTINGS);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result?.value);
  });
};

/**
 * Save device metadata
 * @param {Object} meta - Device metadata { deviceId, metaType, value, period }
 * @returns {Promise<number>}
 */
export const saveDeviceMeta = async (meta) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.DEVICE_META], 'readwrite');
    const store = transaction.objectStore(STORES.DEVICE_META);
    const request = store.add({
      ...meta,
      createdAt: new Date().toISOString()
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get device metadata
 * @param {number} deviceId
 * @param {string} metaType
 * @returns {Promise<Array>}
 */
export const getDeviceMeta = async (deviceId, metaType) => {
  const database = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.DEVICE_META], 'readonly');
    const store = transaction.objectStore(STORES.DEVICE_META);
    const index = store.index('deviceId');
    const request = index.getAll(deviceId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result.filter(meta => meta.metaType === metaType);
      resolve(results);
    };
  });
};

// Initialize database on module load
initializeDatabase().catch(err => console.error('Failed to initialize database:', err));
