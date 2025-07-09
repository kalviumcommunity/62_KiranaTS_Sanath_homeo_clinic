// src/components/CountUpNumber.jsx
import { useEffect, useState } from "react";

export default function CountUpNumber({ end, duration = 3000, shouldStart }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * end);
      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(step);
  }, [shouldStart, end, duration]);

  return <span>{count.toLocaleString()}</span>;
}
