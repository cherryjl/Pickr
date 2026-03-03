import { useMemo } from "react";

export default function Wheel({
  segments,
  rotation,
  onSpin,
  onSpinEnd,
  isSpinning,
  result
}) {
  const sliceStyle = useMemo(() => {
    if (!segments.length) return {};

    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f43f5e",
      "#f97316",
      "#22c55e",
      "#14b8a6",
      "#0ea5e9"
    ];

    let gradient = "";
    segments.forEach((segment, i) => {
      const start = segment.startAngle;
      const end = segment.endAngle;
      const color = colors[i % colors.length];

      gradient += `${color} ${start}deg ${end}deg, `;
    });

    return {
      background: `conic-gradient(${gradient.slice(0, -2)})`
    };
  }, [segments]);

  return (
    <div style={{ textAlign: "center" }}>
      <div className="pointer" />

      <div className="wheel-wrapper">
        <div
          className="wheel"
          style={{
            ...sliceStyle,
            transform: `rotate(${rotation}deg)`
          }}
          onTransitionEnd={e => {
            if (e.propertyName === "transform") {
              onSpinEnd();
            }
          }}
        >
          {segments.map(segment => {
            if (segment.angleSize < 12) return null;

            const angle = segment.centerAngle;

            return (
              <div
                key={segment.id}
                className="wheel-label"
                style={{
                  transform:
                    `translate(-50%, -50%) rotate(${angle}deg) ` +
                    "translateY(-180px) " +
                    `rotate(${-angle}deg)`
                }}
              >
                <span>{segment.name}</span>
              </div>
            );
          })}

          <div className="wheel-center" />
        </div>
      </div>

      <button onClick={onSpin} style={{ marginTop: "2rem" }} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin"}
      </button>

      {result && (
        <h2 className="reveal" style={{ marginTop: "1.5rem" }}>
          Winner: {result}
        </h2>
      )}
    </div>
  );
}
