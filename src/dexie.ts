import Dexie from 'dexie';
import TIMES from './data/times.json' with { type: 'json' };
import SESSIONS from './data/sessions.json' with { type: 'json' };
import { get_best_aon } from './utils';
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
    for (const time of TIMES) {
      let temp = time
      await db.times.add(time);
      temp.id = temp.id + '1'
      await db.times.add(temp);
      temp.id = temp.id + '2'
      await db.times.add(temp);
      temp.id = temp.id + '3'
      await db.times.add(temp);
      temp.id = temp.id + '4'
      await db.times.add(temp);
    }
    
    console.log(`inserting ${TIMES.length * 5} took`, performance.now() - t, 'ms');
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

export async function getBestAO5FromDexie(): Promise<number> {
  console.log('fetching from dexie...');
  const t = performance.now();
  const results = await db.times.where("session_id").equals("6_s9_sqiUPg69qSm7RPTe").sortBy("timestamp");
  let best_ao5 = get_best_aon(5, 1, results);
  console.log('best ao5', best_ao5);
  return Math.round(performance.now() - t);
}
