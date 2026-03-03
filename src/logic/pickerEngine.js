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

export function pickTask(tasks, availableTime) {
  const now = Date.now();

  // Remove impossible tasks
  const viable = tasks.filter(t => availableTime >= t.min);

  if (viable.length === 0) return null;

  const weighted = viable.map(task => {
    let fitness = 1 - Math.abs(availableTime - task.ideal) / task.ideal;

    // Efficiency bias for short sessions
    if (availableTime <= 30) {
      fitness *= task.ideal <= 40 ? 1.3 : 0.7;
    }

    // Novelty bias (avoid repeats)
    const timeSince = now - task.lastPicked;
    if (timeSince < 15 * 60 * 1000) {
      fitness *= 0.4;
    }

    return {
      ...task,
      weight: Math.max(0.05, fitness)
    };
  });

  const total = weighted.reduce((s, t) => s + t.weight, 0);
  let rand = Math.random() * total;

  for (let task of weighted) {
    rand -= task.weight;
    if (rand <= 0) return task;
  }

  return weighted[0];
}