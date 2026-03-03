export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="segmented">
      {["wheel", "slot", "dice"].map((m) => (
        <button
          key={m}
          className={mode === m ? "active" : ""}
          onClick={() => setMode(m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
