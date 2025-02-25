import Dexie from 'dexie';
import TIMES from './data/times.json' with { type: 'json' };
import SESSIONS from './data/sessions.json' with { type: 'json' };
// Define the database
const db = new Dexie('TodoDatabase');

// Define database schema
db.version(2).stores({
  times: 'id,session_id,updated,timestamp',
  sessions: 'id,updated,order'
});

var all = Dexie.Promise.all;

export async function seedDexie(): Promise<number>{
  const start = performance.now();
  console.log('seeding dexie...');
  {
    const t = performance.now();
    await db.sessions.bulkAdd(SESSIONS);
    console.log(`inserting ${SESSIONS.length} todos took`, performance.now() - t, 'ms');
  }
  {
    const t = performance.now();
    await db.times.bulkAdd(TIMES);
    console.log(`inserting ${TIMES.length} took`, performance.now() - t, 'ms');
  }
  return Math.round(performance.now() - start);
}

export async function fetchTimesFromDexie():Promise<number>{
  console.log('fetching from dexie...');
  const t = performance.now();
  const results = await db.times.where("session_id").equals("6_s9_sqiUPg69qSm7RPTe").toArray();
  console.log(`fetching ${results.length} completed todos took`, performance.now() - t, 'ms');
  console.log('results', results);
  return Math.round(performance.now() - t);
}

export async function fetchTimesComplexFromDexie():Promise<number>{
  console.log('fetching from dexie...');
  const t = performance.now();
  const results = await db.times.where("session_id").equals("6_s9_sqiUPg69qSm7RPTe").and((time) => time.time < 16000).toArray();
  console.log(`fetching ${results.length} completed todos took`, performance.now() - t, 'ms');
  console.log('results', results);
  return Math.round(performance.now() - t);
}
