import { useState } from "react";
import { pickTask } from "../logic/pickerEngine";
import Wheel from "./Wheel";
import Slot from "./Slot";
import Dice from "./Dice";
import ModeSelector from "./ModeSelector";

export default function Picker({ tasks, time, setTasks }) {
  const [mode, setMode] = useState("wheel");
  const [selected, setSelected] = useState(null);

  function roll() {
    const result = pickTask(tasks, time);
    if (!result) return;

    result.lastPicked = Date.now();
    setTasks([...tasks]);
    setSelected(result);
  }

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <ModeSelector mode={mode} setMode={setMode} />
      </div>

      {mode === "wheel" && (
        <Wheel tasks={tasks} selected={selected} roll={roll} />
      )}

      {mode === "slot" && <Slot tasks={tasks} selected={selected} roll={roll} />}

      {mode === "dice" && <Dice tasks={tasks} selected={selected} roll={roll} />}
    </div>
  );
}
