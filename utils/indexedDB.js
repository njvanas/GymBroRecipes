import { get, set, del, clear } from 'idb-keyval';

export async function saveData(key, value) {
  try {
    await set(key, value);
  } catch (err) {
    console.warn('Error saving data', err);
  }
}

export async function getData(key) {
  try {
    return await get(key);
  } catch (err) {
    console.warn('Error getting data', err);
    return undefined;
  }
}

export async function deleteData(key) {
  try {
    await del(key);
  } catch (err) {
    console.warn('Error deleting data', err);
  }
}

export async function clearAllData() {
  try {
    await clear();
  } catch (err) {
    console.warn('Error clearing data', err);
  }
}
