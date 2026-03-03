import { useState } from "react";
import { createTask } from "../logic/pickerEngine";

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

    setTasks([...tasks, createTask(trimmedName, min, ideal)]);
    setName("");
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

    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? { ...task, name: trimmedName, min: editMin, ideal: editIdeal }
          : task
      )
    );
    setEditingId(null);
    setEditName("");
  }

  function removeTask(taskId) {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (editingId === taskId) {
      cancelEdit();
    }
  }

  return (
    <div className="task-manager">
      <div className="input-row">
        <input
          className="task-name"
          placeholder="Task name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="task-time-field">
          <label htmlFor="min-time">Minimum time</label>
          <input
            id="min-time"
            type="number"
            value={min}
            onChange={e => setMin(+e.target.value)}
            className="task-number"
          />
        </div>
        <div className="task-time-field">
          <label htmlFor="ideal-time">Ideal time</label>
          <input
            id="ideal-time"
            type="number"
            value={ideal}
            onChange={e => setIdeal(+e.target.value)}
            className="task-number"
          />
        </div>
        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks.map(task =>
          editingId === task.id ? (
            <div key={task.id} className="task-item task-item-editing">
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="task-edit-name"
              />
              <div className="task-edit-time">
                <input
                  type="number"
                  value={editMin}
                  onChange={e => setEditMin(+e.target.value)}
                  className="task-number"
                />
                <input
                  type="number"
                  value={editIdeal}
                  onChange={e => setEditIdeal(+e.target.value)}
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
                  ✓
                </button>
                <button
                  type="button"
                  className="task-icon-btn task-delete-btn"
                  onClick={cancelEdit}
                  aria-label="Cancel edit"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div key={task.id} className="task-item">
              <span className="task-item-name">{task.name}</span>
              <span className="task-item-time">{task.min}-{task.ideal}m</span>
              <div className="task-item-actions">
                <button
                  type="button"
                  className="task-icon-btn"
                  onClick={() => startEdit(task)}
                  aria-label="Edit task"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="task-icon-btn task-delete-btn"
                  onClick={() => removeTask(task.id)}
                  aria-label="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
