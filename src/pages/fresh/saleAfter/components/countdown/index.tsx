import React, { useState, useEffect, useCallback } from 'react'

interface Props {
  value: number,
  interval?: number
  fontColor?: string
}

function formatTime (seconds: number) {
  const secondsOfDay = 24 * 60 * 60
  const secondsOfHour = 60 * 60
  const secondsOfMinute = 60
  const d = Math.floor(seconds / secondsOfDay)
  const h = Math.floor(seconds % secondsOfDay / secondsOfHour)
  const m = Math.floor(seconds % secondsOfHour / secondsOfMinute)
  const s = Math.floor(seconds % secondsOfMinute)
  let result = ''
  if (d) {
    result += `${d}天 `
  }
  if (h) {
    result += `${h}时`
  }
  if (m) {
    result += `${m}分`
  }
  if (s) {
    result += `${s}秒`
  }
  return result
}

/** 倒计时组件 */
function Countdown ({ value, interval = 1000, fontColor = 'red' }: Props) {
  const [state, set] = useState<number>(value)
  useEffect(() => {
    let nowState = state
    const timerID = setInterval(() => {
      if (nowState > 0) {
        set(x => {
          return x - 1
        })
        nowState = nowState - 1
      } else {
        set(0)
        clearInterval(timerID)
      }
    }, interval)
    return () => {
      clearInterval(timerID)
    }
  }, [])
  return <span style={{ color: fontColor }}>{ state > 0 ?formatTime(state) : '超时未审核，自动完成售后'}</span>
}

export default Countdown