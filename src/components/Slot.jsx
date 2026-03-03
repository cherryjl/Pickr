import { useState, useEffect } from "react";

export default function Slot({ selected, roll }) {
  const [display, setDisplay] = useState("???");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (selected) {
      setSpinning(true);

      setTimeout(() => {
        setDisplay(selected.name);
        setSpinning(false);
      }, 2000);
    }
  }, [selected]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "2rem",
          height: "3rem",
          marginBottom: "1rem",
          transition: "all 0.2s",
          transform: spinning ? "translateY(-10px)" : "none"
        }}
      >
        {display}
      </div>

      <button onClick={roll}>Pull Lever</button>
    </div>
  );
}