import { PGlite, types } from "@electric-sql/pglite";
import TIMES from './data/times.json' with { type: 'json' };
import SESSIONS from './data/sessions.json' with { type: 'json' };

const db = new PGlite("idb://my-pgdata",
{ relaxedDurability: true,
  // initialMemory: 1024 * 1024 * 256 //maybe?
}
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

  CREATE INDEX IF NOT EXISTS idx_times_session_id_covering 
ON times (session_id) INCLUDE (time, penalty);
  CREATE INDEX IF NOT EXISTS idx_times_timestamp ON times(timestamp);
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
    for (const time of TIMES) {
      const query = `INSERT INTO times (id, session_id, time, user_id, penalty, scramble, comment, timestamp) VALUES ('${time.id}1', '${time.session_id}', ${time.time}, ${time.user_id}, ${time.penalty}, '${time.scramble.replace(/'/g, "''")}', '${time.comment.replace(/'/g, "''")}', '${time.timestamp}')`;
      await db.exec(query);
      
    }
    for (const time of TIMES) {
      const query = `INSERT INTO times (id, session_id, time, user_id, penalty, scramble, comment, timestamp) VALUES ('${time.id}2', '${time.session_id}', ${time.time}, ${time.user_id}, ${time.penalty}, '${time.scramble.replace(/'/g, "''")}', '${time.comment.replace(/'/g, "''")}', '${time.timestamp}')`;
      await db.exec(query);
      
    }
    for (const time of TIMES) {
      const query = `INSERT INTO times (id, session_id, time, user_id, penalty, scramble, comment, timestamp) VALUES ('${time.id}3', '${time.session_id}', ${time.time}, ${time.user_id}, ${time.penalty}, '${time.scramble.replace(/'/g, "''")}', '${time.comment.replace(/'/g, "''")}', '${time.timestamp}')`;
      await db.exec(query);
      
    }
    for (const time of TIMES) {
      const query = `INSERT INTO times (id, session_id, time, user_id, penalty, scramble, comment, timestamp) VALUES ('${time.id}4', '${time.session_id}', ${time.time}, ${time.user_id}, ${time.penalty}, '${time.scramble.replace(/'/g, "''")}', '${time.comment.replace(/'/g, "''")}', '${time.timestamp}')`;
      await db.exec(query);
      
    }
    //await db.exec(`INSERT INTO times (id, session_id, time, user_id, penalty, scramble, comment, timestamp) VALUES ${TIMES.map(time => `('${time.id}', '${time.session_id}', ${time.time}, ${time.user_id}, ${time.penalty}, '${time.scramble}', '${time.comment}', '${time.timestamp}')`).join(", ")}`);
    console.log(`inserting ${TIMES.length * 5} times took`, performance.now() - t, "ms");
  }

  return Math.round(performance.now() - start);
}

export async function fetchTimesFromPGLite(): Promise<number> {
  console.log("fetching from pglite...");
  const t = performance.now();
  const results = await db.exec(`SELECT id, time, penalty FROM times WHERE session_id = '6_s9_sqiUPg69qSm7RPTe'`, {
    rowMode: "array"
  });
  console.log(`fetching ${results[0].rows.length} completed todos took`, performance.now() - t, "ms");
  console.log("results", results);
  return Math.round(performance.now() - t);
}

export async function fetchTimesComplexFromPGLite(): Promise<number> {
  console.log("fetching from pglite...");
  const t = performance.now();
  const results = await db.exec(`SELECT id, time, penalty FROM times WHERE session_id = '6_s9_sqiUPg69qSm7RPTe' AND time < 16000 `, 
    {
      rowMode: "array",
    }
  );
  console.log(`fetching ${results[0].rows.length} completed todos took`, performance.now() - t, "ms");
  console.log("results", results);
  return Math.round(performance.now() - t);
}

export async function getBestAO5FromPGLite(): Promise<number> {
  console.log("fetching from pglite...");
  const t = performance.now();
  let res2 = await db.exec(`
SELECT MIN(ao5) AS best_ao5
FROM (
    SELECT (
        SELECT AVG(t)
        FROM (
            SELECT unnest(window_times) AS t
            ORDER BY t OFFSET 1
            LIMIT 3
          ) AS middle_values
      ) AS ao5
    FROM (
        SELECT id,
          ARRAY_AGG(time) OVER (
            ORDER BY timestamp ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
          ) AS window_times
        FROM times
        WHERE session_id = '6_s9_sqiUPg69qSm7RPTe'
      ) sub
    WHERE array_length(window_times, 1) = 5
  ) ao5_calculations;
`)
  console.log("best ao5", res2[0].rows[0].best_ao5);
    
  return Math.round(performance.now() - t);
}

