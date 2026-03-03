import { useState } from "react";
import TaskManager from "./components/TaskManager";
import TimeSelector from "./components/TimeSelector";
import Picker from "./components/Picker";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [time, setTime] = useState(40);

  return (
    <div className="container">
      <h1>Pickr</h1>

      <div className="card">
        <TimeSelector time={time} setTime={setTime} />
      </div>

      <div className="card">
        <TaskManager tasks={tasks} setTasks={setTasks} />
      </div>

      <div className="card">
        <Picker tasks={tasks} time={time} setTasks={setTasks} />
      </div>
    </div>
  );
}