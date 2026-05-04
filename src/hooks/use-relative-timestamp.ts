import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

const UPDATE_INTERVAL = 30000

export function useRelativeTimestamp(date: Date) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), UPDATE_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return formatDistanceToNow(date, { addSuffix: true })
}
