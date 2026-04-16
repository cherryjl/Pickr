import { useState } from "react";
import { createTask } from "../logic/pickerEngine";

const TASK_PRESETS = [
  { name: "Gaming", min: 30, ideal: 60 },
  { name: "Reading", min: 20, ideal: 45 },
  { name: "Watching anime", min: 20, ideal: 40 },
  { name: "Watching TV", min: 50, ideal: 50 },
  { name: "Watching a movie", min: 90, ideal: 120 },
];

function parseMinutes(value, fallback = 1) {
  const digitsOnly = value.replace(/[^\d]/g, "");
  if (!digitsOnly) return fallback;
  return Math.max(1, Number.parseInt(digitsOnly, 10));
}

function normalizeTaskTimes(min, ideal) {
  const safeMin = Math.max(1, min);
  return {
    min: safeMin,
    ideal: Math.max(safeMin, ideal),
  };
}

export default function TaskManager({ tasks, setTasks }) {
  const [name, setName] = useState("");
  const [min, setMin] = useState(20);
  const [ideal, setIdeal] = useState(40);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMin, setEditMin] = useState(20);
  const [editIdeal, setEditIdeal] = useState(40);

  function addTask() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const times = normalizeTaskTimes(min, ideal);
    setTasks([...tasks, createTask(trimmedName, times.min, times.ideal)]);
    setName("");
  }

  function addPreset(preset) {
    setTasks((current) => [
      ...current,
      createTask(preset.name, preset.min, preset.ideal),
    ]);
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditName(task.name);
    setEditMin(task.min);
    setEditIdeal(task.ideal);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  function saveEdit(taskId) {
    const trimmedName = editName.trim();
    if (!trimmedName) return;
    const times = normalizeTaskTimes(editMin, editIdeal);

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, name: trimmedName, min: times.min, ideal: times.ideal }
          : task,
      ),
    );
    setEditingId(null);
    setEditName("");
  }

  function removeTask(taskId) {
    setTasks(tasks.filter((task) => task.id !== taskId));
    if (editingId === taskId) {
      cancelEdit();
    }
  }

  return (
    <div className="task-manager">
      <div className="task-presets">
        {TASK_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className="preset-btn"
            onClick={() => addPreset(preset)}
          >
            {preset.name} ({preset.min}-{preset.ideal}m)
          </button>
        ))}
      </div>

      <div className="input-row">
        <input
          className="task-name"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="task-time-field">
          <label htmlFor="min-time">Minimum time</label>
          <input
            id="min-time"
            type="number"
            value={min}
            inputMode="numeric"
            onFocus={(e) => e.target.select()}
            onChange={(e) => setMin(parseMinutes(e.target.value, min))}
            className="task-number"
          />
        </div>
        <div className="task-time-field">
          <label htmlFor="ideal-time">Ideal time</label>
          <input
            id="ideal-time"
            type="number"
            value={ideal}
            inputMode="numeric"
            onFocus={(e) => e.target.select()}
            onChange={(e) => setIdeal(parseMinutes(e.target.value, ideal))}
            className="task-number"
          />
        </div>
        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks.map((task) =>
          editingId === task.id ? (
            <div key={task.id} className="task-item task-item-editing">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="task-edit-name"
              />
              <div className="task-edit-time">
                <input
                  type="number"
                  value={editMin}
                  inputMode="numeric"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setEditMin(parseMinutes(e.target.value, editMin))
                  }
                  className="task-number"
                />
                <input
                  type="number"
                  value={editIdeal}
                  inputMode="numeric"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setEditIdeal(parseMinutes(e.target.value, editIdeal))
                  }
                  className="task-number"
                />
              </div>
              <div className="task-item-actions">
                <button
                  type="button"
                  className="task-icon-btn"
                  onClick={() => saveEdit(task.id)}
                  aria-label="Save task"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="task-icon-btn task-delete-btn"
                  onClick={cancelEdit}
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div key={task.id} className="task-item">
              <span className="task-item-name">{task.name}</span>
              <span className="task-item-time">
                {task.min}-{task.ideal}m
              </span>
              <div className="task-item-actions">
                <button
                  type="button"
                  className="task-icon-btn"
                  onClick={() => startEdit(task)}
                  aria-label="Edit task"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="task-icon-btn task-delete-btn"
                  onClick={() => removeTask(task.id)}
                  aria-label="Delete task"
                >
                  Del
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
