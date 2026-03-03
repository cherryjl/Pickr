import { useMemo, useState } from "react";
import { getWeightedTasks } from "../logic/pickerEngine";
import Wheel from "./Wheel";

export default function Picker({ tasks, time, setTasks}) {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningSegments, setSpinningSegments] = useState(null);

  const segments = useMemo(() => {
    const weightedTasks = getWeightedTasks(tasks, time);
    if (!weightedTasks.length) return [];

    const totalWeight = weightedTasks.reduce((sum, task) => sum + task.weight, 0);
    let cursor = 0;

    return weightedTasks.map(task => {
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
        weight: task.weight
      };
    });
  }, [tasks, time]);

  const activeSegments = spinningSegments ?? segments;

  function drawWeightedSegment(weightedSegments) {
    const totalWeight = weightedSegments.reduce((sum, segment) => sum + segment.weight, 0);
    let random = Math.random() * totalWeight;

    for (const segment of weightedSegments) {
      random -= segment.weight;
      if (random <= 0) return segment;
    }

    return weightedSegments[0];
  }

  const spinWheel = () => {
    if (!segments.length || isSpinning) return;

    const selectedSegment = drawWeightedSegment(segments);
    if (!selectedSegment) return;

    const pointerAngle = 0;
    const extraTurns = 6 + Math.floor(Math.random() * 2);

    setSpinningSegments(segments);

    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === selectedSegment.id
          ? { ...task, lastPicked: Date.now() }
          : task
      )
    );

    setResult(null);
    setPendingResult(selectedSegment.name);
    setIsSpinning(true);
    setRotation(prev => {
      const currentAngle = ((prev % 360) + 360) % 360;
      const alignDelta =
        ((pointerAngle - selectedSegment.centerAngle - currentAngle) % 360 + 360) % 360;
      const spinAmount = extraTurns * 360 + alignDelta;
      return prev + spinAmount;
    });
  };

  const handleSpinEnd = () => {
    if (!isSpinning) return;
    setIsSpinning(false);
    setSpinningSegments(null);
    setResult(pendingResult);
    setPendingResult(null);
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
