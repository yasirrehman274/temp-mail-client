import { formatRelativeTime } from '../../utils/format.js'

function avatarColors(name) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return {
    backgroundColor: `hsl(${hue} 72% 92%)`,
    color: `hsl(${hue} 55% 34%)`,
  }
}

function EmailListItem({ email, onClick }) {
  const initial = (email.sender || '?').trim().charAt(0).toUpperCase()

  return (
    <li className="email-item-wrap">
      <button
        type="button"
        className={`email-item${email.unread ? ' is-unread' : ''}`}
        onClick={onClick}
      >
        <span className="email-avatar" style={avatarColors(email.sender)} aria-hidden="true">
          {initial}
        </span>
        <span className="email-main">
          <span className="email-sender">{email.sender}</span>
          <span className="email-subject">{email.subject}</span>
          <span className="email-preview">{email.preview}</span>
        </span>
        <span className="email-meta">
          {email.unread && (
            <span className="unread-dot" aria-hidden="true">
              <span className="sr-only">Unread</span>
            </span>
          )}
          <span className="email-time">{formatRelativeTime(email.receivedAt)}</span>
        </span>
      </button>
    </li>
  )
}

export default EmailListItem
