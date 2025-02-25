import { PGlite } from "@electric-sql/pglite";
import TIMES from './data/times.json' with { type: 'json' };
import SESSIONS from './data/sessions.json' with { type: 'json' };

const db = new PGlite("idb://my-pgdata",
{ relaxedDurability: true,}
);

await db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER DEFAULT 0,
    scramble_type TEXT DEFAULT '333',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS times (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    time INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    penalty INTEGER DEFAULT 0,
    scramble TEXT DEFAULT '',
    comment TEXT DEFAULT '',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );

  CREATE INDEX IF NOT EXISTS idx_times_session_id ON times(session_id);
`);

export async function seedPGLite(): Promise<number> {
  const start = performance.now();
  console.log("seeding pglite...");

  {
    const t = performance.now();
    await db.exec(`INSERT INTO sessions (id, user_id, name, "order", scramble_type, created_at) VALUES ${SESSIONS.map(session => `('${session.id}', ${session.user_id}, '${session.name}', ${session.order}, '${session.scramble_type}', '${session.created_at}')`).join(", ")}`);
    console.log(`inserting ${SESSIONS.length} sessions took`, performance.now() - t, "ms");
  }

  {
    const t = performance.now();
    for (const time of TIMES) {
      const query = `INSERT INTO times (id, session_id, time, user_id, penalty, scramble, comment, timestamp) VALUES ('${time.id}', '${time.session_id}', ${time.time}, ${time.user_id}, ${time.penalty}, '${time.scramble.replace(/'/g, "''")}', '${time.comment.replace(/'/g, "''")}', '${time.timestamp}')`;
      await db.exec(query);
      
    }
    //await db.exec(`INSERT INTO times (id, session_id, time, user_id, penalty, scramble, comment, timestamp) VALUES ${TIMES.map(time => `('${time.id}', '${time.session_id}', ${time.time}, ${time.user_id}, ${time.penalty}, '${time.scramble}', '${time.comment}', '${time.timestamp}')`).join(", ")}`);
    console.log(`inserting ${TIMES.length} times took`, performance.now() - t, "ms");
  }

  return Math.round(performance.now() - start);
}

export async function fetchTodosFromPGLite(): Promise<number> {
  console.log("fetching from pglite...");
  const t = performance.now();
  const results = await db.exec(`SELECT * FROM times WHERE session_id = '6_s9_sqiUPg69qSm7RPTe'`);
  console.log(`fetching ${results[0].rows.length} completed todos took`, performance.now() - t, "ms");
  console.log("results", results);
  return Math.round(performance.now() - t);
}
