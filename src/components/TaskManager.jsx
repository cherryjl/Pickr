import { useState } from "react";
import { createTask } from "../logic/pickerEngine";

export default function TaskManager({ tasks, setTasks }) {
  const [name, setName] = useState("");
  const [min, setMin] = useState(20);
  const [ideal, setIdeal] = useState(40);

  function addTask() {
    if (!name) return;
    setTasks([...tasks, createTask(name, min, ideal)]);
    setName("");
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
        <input
          type="number"
          value={min}
          onChange={e => setMin(+e.target.value)}
          className="task-number"
          placeholder="Min"
        />
        <input
          type="number"
          value={ideal}
          onChange={e => setIdeal(+e.target.value)}
          className="task-number"
          placeholder="Ideal"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks.map(t => (
          <div key={t.id} className="task-item">
            <span>{t.name}</span>
            <span>{t.min}-{t.ideal}m</span>
          </div>
        ))}
      </div>
    </div>
  );
}
