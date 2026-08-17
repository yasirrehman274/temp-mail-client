import { useEffect, useState } from 'react'
import { ClockIcon } from '../icons.jsx'
import { formatCountdown } from '../../utils/format.js'

function getRemainingSeconds(expiresAt) {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
}

function ExpirationTimer({ expiresAt, expired = false, onExpired }) {
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(expiresAt))

  useEffect(() => {
    if (expired) return undefined
    const tick = () => {
      const seconds = getRemainingSeconds(expiresAt)
      setRemaining(seconds)
      if (seconds <= 0) onExpired()
    }
    tick()
    const intervalId = setInterval(tick, 1000)
    return () => clearInterval(intervalId)
  }, [expiresAt, expired, onExpired])

  return (
    <div className={`timer${expired ? ' is-expired' : ''}`} aria-live="polite">
      <ClockIcon size={18} />
      <span className="timer-label">{expired ? 'Email expired' : 'Expires in'}</span>
      <span className="timer-value">{expired ? '00 : 00' : formatCountdown(remaining)}</span>
    </div>
  )
}

export default ExpirationTimer
