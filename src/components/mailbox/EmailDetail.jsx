import { ArrowLeftIcon, CopyIcon, TrashIcon } from '../icons.jsx'
import { formatDateTime } from '../../utils/format.js'
import Button from '../ui/Button.jsx'
import LoadingState from '../ui/LoadingState.jsx'

function EmailDetail({
  email,
  mailbox,
  loading = false,
  onBack,
  onDelete,
  onCopySender,
  onCopyAddress,
}) {
  if (loading) return <LoadingState variant="detail" />
  if (!email) return null

  const isHtml = typeof email.html === 'string' && email.html.length > 0

  return (
    <div className="email-detail">
      <div className="detail-header">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon size={16} />
          Back to Inbox
        </Button>
        <Button variant="danger-ghost" size="sm" onClick={onDelete}>
          <TrashIcon size={16} />
          Delete
        </Button>
      </div>

      <h2 className="detail-subject">{email.subject}</h2>

      <dl className="detail-meta">
        <div className="detail-row">
          <dt>From</dt>
          <dd>
            <strong>{email.sender}</strong> &lt;{email.senderEmail}&gt;
            <button
              type="button"
              className="copy-btn"
              onClick={onCopySender}
              aria-label={`Copy sender address ${email.senderEmail}`}
            >
              <CopyIcon size={14} />
            </button>
          </dd>
        </div>
        <div className="detail-row">
          <dt>To</dt>
          <dd>
            {mailbox?.address}
            <button
              type="button"
              className="copy-btn"
              onClick={onCopyAddress}
              aria-label={`Copy email address ${mailbox?.address}`}
            >
              <CopyIcon size={14} />
            </button>
          </dd>
        </div>
        <div className="detail-row">
          <dt>Received</dt>
          <dd>{formatDateTime(email.receivedAt)}</dd>
        </div>
      </dl>

      {isHtml ? (
        <div className="detail-html" dangerouslySetInnerHTML={{ __html: email.html }} />
      ) : (
        <div className="detail-body">
          {email.body.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmailDetail
