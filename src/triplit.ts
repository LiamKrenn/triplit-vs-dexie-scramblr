import { type Models, Schema as S } from '@triplit/db';
import {DB, IndexedDbExperimentalKVStore} from '@triplit/entity-db'
import SESSIONS from './data/sessions.json' with { type: 'json' };
import TIMES from './data/times.json' with { type: 'json' };

export const schema = {
  sessions: {
    schema: S.Schema({
      id: S.Id(),
      user_id: S.Number(),
      name: S.String({ default: S.Default.now() }),
      order: S.Number({ default: 0 }),
      scramble_type: S.String({ default: "333" }),
      times: S.RelationMany("times", {
        where: [["session_id", "=", "$id"]],
      }),
      created_at: S.Date({ default: S.Default.now() }),
    }),
  },
  times: {
    schema: S.Schema({
      id: S.Id(),
      session_id: S.String(),
      time: S.Number(),
      user_id: S.Number(),
      penalty: S.Number({ default: 0 }),
      scramble: S.String({ nullable: true, default: "" }),
      comment: S.String({ nullable: true, default: "" }),
      timestamp: S.Date({ default: S.Default.now() }),
    }),
  },
} satisfies Models<any, any>;

const idbStorage = new IndexedDbExperimentalKVStore('triplit', { batchSize: 10000 });
const db = new DB({schema: {collections: schema}, kv:idbStorage});

export async function seedTriplit() : Promise<number>{
  const start = performance.now();
  console.log('seeding triplit...');
  {
    const t = performance.now();
    await db.transact(async (tx)=>{
      for (const session of SESSIONS) {
        await tx.insert('sessions', session);
      }
    })
    console.log(`inserting ${SESSIONS.length} sessions took`, performance.now() - t, 'ms');
  }
  {
    const t = performance.now();
    await db.transact(async (tx)=>{
      for (const time of TIMES) {
        await tx.insert('times', time);
      }
    });
    console.log(`inserting ${TIMES.length} times took`, performance.now() - t, 'ms');
  }
  return Math.round(performance.now() - start);
}

export async function fetchTimesFromTriplit():Promise<number>{
  const start = performance.now();

  console.log('fetching from triplit...');
  const t = performance.now();
  const results = await db.fetch(db.query('times').where('session_id', '=', "6_s9_sqiUPg69qSm7RPTe").build())
  console.log(`fetching ${results.length} todos took`, performance.now() - t, 'ms');
  console.log('results', results);
  return Math.round(performance.now() - start);
}

export async function fetchTimesComplexFromTriplit():Promise<number>{
  const start = performance.now();

  console.log('fetching from triplit...');
  const t = performance.now();
  const results = await db.fetch(db.query('times').where('session_id', '=', "6_s9_sqiUPg69qSm7RPTe").where("time", "<", 16000).build())
  console.log(`fetching ${results.length} todos took`, performance.now() - t, 'ms');
  console.log('results', results);
  return Math.round(performance.now() - start);
}