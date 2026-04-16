import { useMemo, useState } from "react";
import { getWeightedTasks } from "../logic/pickerEngine";
import Wheel from "./Wheel";

function buildSegments(weightedTasks) {
  if (!weightedTasks.length) return [];

  const totalWeight = weightedTasks.reduce((sum, task) => sum + task.weight, 0);
  let cursor = 0;

  return weightedTasks.map((task) => {
    const angleSize = (task.weight / totalWeight) * 360;
    const startAngle = cursor;
    const endAngle = startAngle + angleSize;
    cursor = endAngle;

    return {
      id: task.id,
      name: task.name,
      startAngle,
      endAngle,
      angleSize,
      centerAngle: startAngle + angleSize / 2,
      weight: task.weight,
    };
  });
}

export default function Picker({ tasks, time, setTasks }) {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [pendingWinner, setPendingWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lockedSegments, setLockedSegments] = useState(null);
  const [pinnedVisualSegments, setPinnedVisualSegments] = useState(null);
  const [pinnedVisualKey, setPinnedVisualKey] = useState(null);

  const structuralKey = useMemo(
    () =>
      JSON.stringify({
        time,
        tasks: tasks.map((task) => ({
          id: task.id,
          name: task.name,
          min: task.min,
          ideal: task.ideal,
        })),
      }),
    [tasks, time],
  );

  const computedSegments = useMemo(() => {
    const weightedTasks = getWeightedTasks(tasks, time);
    return buildSegments(weightedTasks);
  }, [tasks, time]);

  const persistentVisual =
    pinnedVisualSegments && pinnedVisualKey === structuralKey
      ? pinnedVisualSegments
      : null;

  const activeSegments = lockedSegments ?? persistentVisual ?? computedSegments;

  function drawWeightedSegment(weightedSegments) {
    const totalWeight = weightedSegments.reduce(
      (sum, segment) => sum + segment.weight,
      0,
    );
    let random = Math.random() * totalWeight;

    for (const segment of weightedSegments) {
      random -= segment.weight;
      if (random <= 0) return segment;
    }

    return weightedSegments[0];
  }

  const spinWheel = () => {
    if (isSpinning) return;

    const spinSegments = computedSegments;
    if (!spinSegments.length) return;

    const selectedSegment = drawWeightedSegment(spinSegments);
    if (!selectedSegment) return;

    const pointerAngle = 0;
    const extraTurns = 6 + Math.floor(Math.random() * 2);

    setPinnedVisualSegments(spinSegments);
    setPinnedVisualKey(structuralKey);
    setLockedSegments(spinSegments);
    setResult(null);
    setPendingWinner(selectedSegment);
    setIsSpinning(true);

    setRotation((prev) => {
      const currentAngle = ((prev % 360) + 360) % 360;
      const alignDelta =
        (((pointerAngle - selectedSegment.centerAngle - currentAngle) % 360) +
          360) %
        360;
      const spinAmount = extraTurns * 360 + alignDelta;
      return prev + spinAmount;
    });
  };

  const handleSpinEnd = () => {
    if (!isSpinning) return;

    setIsSpinning(false);
    setLockedSegments(null);

    if (!pendingWinner) return;

    setResult(pendingWinner.name);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === pendingWinner.id
          ? { ...task, lastPicked: Date.now() }
          : task,
      ),
    );

    setPendingWinner(null);
  };

  return (
    <Wheel
      segments={activeSegments}
      rotation={rotation}
      onSpin={spinWheel}
      onSpinEnd={handleSpinEnd}
      isSpinning={isSpinning}
      result={result}
    />
  );
}
