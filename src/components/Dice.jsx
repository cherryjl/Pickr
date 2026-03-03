import { useState, useEffect } from "react";

export default function Dice({ tasks, selected, roll }) {
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (selected) {
      setRolling(true);
      setTimeout(() => {
        setRolling(false);
      }, 1500);
    }
  }, [selected]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 100,
          height: 100,
          border: "4px solid white",
          margin: "0 auto",
          borderRadius: 12,
          fontSize: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 1s",
          transform: rolling ? "rotate(720deg)" : "none"
        }}
      >
        {selected ? selected.name[0] : "?"}
      </div>

      <button onClick={roll} style={{ marginTop: "1rem" }}>
        Roll Dice
      </button>

      {selected && <h2>{selected.name}</h2>}
    </div>
  );
}