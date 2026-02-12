import { useEffect, useState } from "react";

function CountUp({ end, start = 0, interval = 30, steps = 40 }) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    let current = start;
    const step = Math.ceil((end - start) / steps);

    const timer = setInterval(() => {
      current += step;

      if (current >= end) {
        current = end;
        clearInterval(timer);
      }

      setValue(current);
    }, interval);

    return () => clearInterval(timer);
  }, [end, start, interval, steps]);

  return <span>{value}</span>;
}

export default CountUp;