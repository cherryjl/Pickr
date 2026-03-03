import { v4 as uuidv4 } from "uuid";

export function createTask(name, min, ideal) {
  return {
    id: uuidv4(),
    name,
    min,
    ideal,
    lastPicked: 0
  };
}

export function getWeightedTasks(tasks, availableTime) {
  const now = Date.now();
  const safeTime = Math.max(0, availableTime);

  // Remove impossible tasks.
  const viable = tasks.filter(task => safeTime >= Math.max(1, task.min));

  if (viable.length === 0) return [];

  return viable.map(task => {
    const min = Math.max(1, task.min);
    const ideal = Math.max(min, task.ideal);
    const ratio = ideal / safeTime;

    // Main fit: strongly favor tasks whose ideal time is near available time.
    const fit = Math.exp(-Math.pow(Math.log(ratio), 2) / (2 * Math.pow(0.45, 2)));

    // Penalize tasks that underfill long sessions.
    const leftoverPenalty =
      ideal <= safeTime
        ? 0.55 + 0.45 * Math.pow(ideal / safeTime, 0.7)
        : 1;

    // Penalize tasks that are technically possible but too cramped under ideal.
    const crampedPenalty =
      ideal > safeTime
        ? 0.65 + 0.35 * Math.pow(safeTime / ideal, 1.2)
        : 1;

    let weight = fit * leftoverPenalty * crampedPenalty;

    // Short-session bias for quick wins when time is limited.
    if (safeTime <= 30) {
      weight *= ideal <= 30 ? 1.25 : 0.85;
    }

    // Novelty bias: discourage immediate repeats.
    const timeSince = now - task.lastPicked;
    if (timeSince < 15 * 60 * 1000) {
      weight *= 0.4;
    }

    return {
      ...task,
      weight: Math.max(0.01, weight)
    };
  });
}

export function pickTask(tasks, availableTime) {
  const weighted = getWeightedTasks(tasks, availableTime);

  if (!weighted.length) return null;

  const total = weighted.reduce((s, t) => s + t.weight, 0);
  let rand = Math.random() * total;

  for (const task of weighted) {
    rand -= task.weight;
    if (rand <= 0) return task;
  }

  return weighted[0];
}
