import { InboxIcon, PlusIcon, RefreshIcon, TrashIcon } from '../icons.jsx'
import Button from '../ui/Button.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import ErrorState from '../ui/ErrorState.jsx'
import LoadingState from '../ui/LoadingState.jsx'
import EmailList from './EmailList.jsx'

function Inbox({
  emails = [],
  loading = false,
  refreshing = false,
  generating = false,
  error = null,
  refreshDisabled = false,
  onRefresh,
  onDeleteInbox,
  onNewEmail,
  onSelect,
}) {
  const unreadCount = emails.filter((email) => email.unread).length

  return (
    <section className="inbox-card" aria-label="Inbox">
      <header className="inbox-header">
        <div className="inbox-title">
          <h2>Inbox</h2>
          <span className="inbox-count">
            {emails.length} {emails.length === 1 ? 'email' : 'emails'}
          </span>
          {unreadCount > 0 && <span className="unread-badge">{unreadCount} new</span>}
        </div>
        <div className="inbox-actions">
          <Button variant="ghost" size="sm" onClick={onNewEmail} loading={generating}>
            <PlusIcon size={15} />
            New Email
          </Button>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={refreshDisabled || loading}>
            <RefreshIcon size={15} />
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteInbox}
            disabled={emails.length === 0}
          >
            <TrashIcon size={15} />
            Delete inbox
          </Button>
        </div>
      </header>
      <div className="inbox-body">
        {loading || refreshing ? (
          <LoadingState variant="list" />
        ) : error ? (
          <ErrorState message={error.message} onRetry={onRefresh} />
        ) : emails.length === 0 ? (
          <EmptyState
            icon={<InboxIcon size={26} />}
            title="Your inbox is empty"
            description="Emails sent to your temporary address will appear here."
            action={
              <Button variant="secondary" size="sm" onClick={onRefresh}>
                <RefreshIcon size={15} />
                Refresh
              </Button>
            }
          />
        ) : (
          <EmailList emails={emails} onSelect={onSelect} />
        )}
      </div>
    </section>
  )
}

export default Inbox
