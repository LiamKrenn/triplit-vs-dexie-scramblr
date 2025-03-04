export function calc_aon(
  index: number,
  aon: number,
  remove_top_bottom_count: number,
  times: { time: number }[]
) {
  let ao_times = times.slice(index, index + aon);
  if (ao_times.length < aon) {
    return -1;
  }
  ao_times.sort((a, b) => a.time - b.time);

  for (let i = 0; i < remove_top_bottom_count; i++) {
    ao_times.pop();
    ao_times.shift();
  }
  const sum = ao_times.reduce((total, time) => total + time.time, 0);
  return sum / ao_times.length;
}

export function get_best_aon(
  aon: number,
  remove_top_bottom_count: number,
  times: { time: number }[]
) {
  let best_aon_time = -1;
  for (let i = 0; i < times.length - aon; i++) {
    const aon_time = calc_aon(i, aon, remove_top_bottom_count, times);
    if (aon_time < best_aon_time || best_aon_time === -1) {
      best_aon_time = aon_time;
    }
  }
  return best_aon_time;
}
