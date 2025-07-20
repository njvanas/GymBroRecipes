import { openDB } from 'idb';

const DB_NAME = 'gymBro';
const DB_VERSION = 1;
const STORE_NAME = 'workouts';

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function saveWorkout(workout) {
  const db = await getDb();
  await db.put(STORE_NAME, workout);
}

export async function getWorkouts() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}
