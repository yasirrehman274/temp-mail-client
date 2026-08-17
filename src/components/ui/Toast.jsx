import { AlertIcon, CheckIcon, InboxIcon } from '../icons.jsx'

function ToastIcon({ type }) {
  if (type === 'error') return <AlertIcon size={14} />
  if (type === 'info') return <InboxIcon size={14} />
  return <CheckIcon size={14} />
}

function Toast({ type = 'success', message }) {
  return (
    <div className={`toast toast-${type}`} role="status">
      <span className="toast-icon">
        <ToastIcon type={type} />
      </span>
      <span className="toast-message">{message}</span>
    </div>
  )
}

function ToastContainer({ toasts = [] }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} type={toast.type} message={toast.message} />
      ))}
    </div>
  )
}

export default ToastContainer
