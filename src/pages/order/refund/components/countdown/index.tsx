import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  value: number;
  interval?: number;
  refresh: () => void;
}

function formatTime (seconds: number) {
  const secondsOfDay = 24 * 60 * 60;
  const secondsOfHour = 60 * 60
  const secondsOfMinute = 60
  const d = Math.floor(seconds / secondsOfDay);
  const h = Math.floor(seconds % secondsOfDay / secondsOfHour);
  const m = Math.floor(seconds % secondsOfHour / secondsOfMinute);
  const s = seconds % secondsOfMinute;
  let result = '';
  if (d) {
    result += `${d}天 `;
  }
  if (h) {
    result += `${h}时`;
  }
  if (m) {
    result += `${m}分`;
  }
  if (s) {
    result += `${s}秒`;
  }
  return result;
}

/** 倒计时组件 */
function Countdown ({ value, refresh, interval = 1000 }: Props) {
  const [state, set] = useState<number>(value);
  useEffect(() => {
    let t = value
    const timerID = setInterval(() => {
      if (t > 0) {
        t--
        set(x => x - 1)
      } else {
        set(0)
        refresh();
        clearInterval(timerID)
      }
    }, interval);
    return () => {
      clearInterval(timerID);
    }
  }, []);
  return <>{ formatTime(state) }</>;
}

export default Countdown;