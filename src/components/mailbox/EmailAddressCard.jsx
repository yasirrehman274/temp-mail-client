import { CheckIcon, CopyIcon, MailIcon } from '../icons.jsx'
import Button from '../ui/Button.jsx'
import LoadingState from '../ui/LoadingState.jsx'

function EmailAddressCard({
  address = '',
  loading = false,
  copied = false,
  expired = false,
  onCopy,
}) {
  if (loading) return <LoadingState variant="address" />

  return (
    <div className="address-card">
      <div className="address-top">
        <span className="address-icon" aria-hidden="true">
          <MailIcon size={18} />
        </span>
        {address && (
          <span className={`address-status${expired ? ' is-expired' : ''}`}>
            {expired ? 'Expired' : 'Active'}
          </span>
        )}
      </div>
      <div className="address-row">
        <span className="address-value">{address || 'Generate a new address to continue'}</span>
        <Button
          variant="primary"
          size="lg"
          onClick={onCopy}
          disabled={expired || !address}
          className="address-copy-btn"
        >
          {copied ? (
            <>
              <CheckIcon size={18} /> Copied!
            </>
          ) : (
            <>
              <CopyIcon size={18} /> Copy
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default EmailAddressCard
