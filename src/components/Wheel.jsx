import { useState, useEffect } from "react";

export default function Wheel({ tasks, selected, roll }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (selected) {
      const spin = 360 * 5 + Math.floor(Math.random() * 360);
      setRotation(spin);
    }
  }, [selected]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "6px solid #6366f1",
          margin: "0 auto",
          transition: "transform 3s cubic-bezier(.17,.67,.83,.67)",
          transform: `rotate(${rotation}deg)`
        }}
      />

      <button onClick={roll} style={{ marginTop: "1rem" }}>
        Spin
      </button>

      {selected && <h2>{selected.name}</h2>}
    </div>
  );
}