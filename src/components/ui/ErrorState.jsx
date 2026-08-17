import { AlertIcon, RefreshIcon } from '../icons.jsx'
import Button from './Button.jsx'

function ErrorState({
  title = 'Something went wrong.',
  message,
  onRetry,
  retryLabel = 'Try Again',
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-icon" aria-hidden="true">
        <AlertIcon size={22} />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshIcon size={16} />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export default ErrorState
