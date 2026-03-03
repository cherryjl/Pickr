export default function TimeSelector({
  time,
  setTime
}) {
  return (
    <div className="time-selector">
      <p className="time-helper">Choose how much time you have available right now.</p>

      <div className="time-presets">
        {[20, 40, 60, 120, 180, 240].map(v => (
          <button
            key={v}
            onClick={() => setTime(v)}
          >
            {v < 60 ? `${v}m` : `${v / 60}h`}
          </button>
        ))}
      </div>

      <input
        type="range"
        min="10"
        max="360"
        step="10"
        value={time}
        onChange={e => setTime(+e.target.value)}
        className="time-range"
      />

      <div className="time-display">
        {Math.floor(time / 60)}h {time % 60}m
      </div>
    </div>
  );
}
