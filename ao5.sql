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