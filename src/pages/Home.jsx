import { useCallback, useEffect, useState } from 'react'
import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'
import EmailAddressCard from '../components/mailbox/EmailAddressCard.jsx'
import ExpirationTimer from '../components/mailbox/ExpirationTimer.jsx'
import Inbox from '../components/mailbox/Inbox.jsx'
import EmailDetail from '../components/mailbox/EmailDetail.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import Modal from '../components/ui/Modal.jsx'
import ToastContainer from '../components/ui/Toast.jsx'
import Button from '../components/ui/Button.jsx'
import { PlusIcon, RefreshIcon } from '../components/icons.jsx'
import { copyText } from '../utils/clipboard.js'
import {
  createMailbox,
  deleteEmail,
  deleteMailbox,
  getEmail,
  getMailboxEmails,
  refreshInbox,
} from '../services/mailboxService.js'

function Home() {
  const [mailbox, setMailbox] = useState(null)
  const [emails, setEmails] = useState([])
  const [addressLoading, setAddressLoading] = useState(true)
  const [inboxLoading, setInboxLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [inboxError, setInboxError] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expired, setExpired] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingInbox, setDeletingInbox] = useState(false)
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      try {
        const mb = await createMailbox()
        if (cancelled) return
        setMailbox(mb)
        const list = await getMailboxEmails(mb.id, mb.token)
        if (cancelled) return
        setEmails(list)
      } catch {
        if (!cancelled) {
          setInboxError({ message: "We couldn't connect to the server." })
        }
      } finally {
        if (!cancelled) {
          setAddressLoading(false)
          setInboxLoading(false)
        }
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])

  const handleExpired = useCallback(() => setExpired(true), [])

  const closeDetail = useCallback(() => setDetailOpen(false), [])
  const openConfirm = useCallback(() => setConfirmOpen(true), [])
  const closeConfirm = useCallback(() => setConfirmOpen(false), [])

  const handleNewEmail = async () => {
    setGenerating(true)
    try {
      const newMailbox = await createMailbox()
      setMailbox(newMailbox)
      setEmails([])
      setSelectedEmail(null)
      setDetailOpen(false)
      setInboxError(null)
      setCopied(false)
      setExpired(false)
      pushToast('New email address generated')
    } catch {
      pushToast('Could not generate a new email address', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyAddress = async () => {
    if (!mailbox) return
    try {
      await copyText(mailbox.address)
      setCopied(true)
      pushToast('Email address copied')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      pushToast('Could not copy the email address', 'error')
    }
  }

  const copyToClipboard = useCallback(
    async (text, successMessage) => {
      try {
        await copyText(text)
        pushToast(successMessage)
      } catch {
        pushToast('Could not copy to clipboard', 'error')
      }
    },
    [pushToast],
  )

  const handleRefresh = async () => {
    if (!mailbox) return
    setRefreshing(true)
    setInboxError(null)
    try {
      const list = await refreshInbox(mailbox.id, mailbox.token)
      setEmails(list)
      pushToast('Inbox refreshed')
    } catch (err) {
      if (err.status === 410) {
        setExpired(true)
        setInboxError({ message: err.message })
      } else {
        setInboxError({ message: "We couldn't refresh your inbox." })
      }
    } finally {
      setRefreshing(false)
    }
  }

  const handleOpenEmail = async (email) => {
    if (!mailbox) return
    setDetailOpen(true)
    setDetailLoading(true)
    try {
      const fullEmail = await getEmail(email.id, mailbox.token)
      setSelectedEmail(fullEmail)
      if (email.unread) {
        setEmails((current) =>
          current.map((item) => (item.id === fullEmail.id ? { ...item, unread: false } : item)),
        )
      }
    } catch (err) {
      setDetailOpen(false)
      if (err.status === 410) {
        setExpired(true)
        pushToast(err.message, 'error')
      } else {
        pushToast('Could not open this email', 'error')
      }
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDeleteEmail = async () => {
    if (!selectedEmail || !mailbox) return
    try {
      await deleteEmail(selectedEmail.id, mailbox.token)
      setEmails((current) => current.filter((item) => item.id !== selectedEmail.id))
      setSelectedEmail(null)
      setDetailOpen(false)
      pushToast('Email deleted')
    } catch (err) {
      if (err.status === 410) setExpired(true)
      pushToast('Could not delete this email', 'error')
    }
  }

  const handleDeleteInbox = async () => {
    if (!mailbox) return
    setDeletingInbox(true)
    try {
      await deleteMailbox(mailbox.id, mailbox.token)
      setMailbox(null)
      setEmails([])
      setSelectedEmail(null)
      setDetailOpen(false)
      setConfirmOpen(false)
      setExpired(false)
      pushToast('Inbox deleted')
    } catch (err) {
      if (err.status === 410) setExpired(true)
      pushToast('Could not delete the inbox', 'error')
    } finally {
      setDeletingInbox(false)
    }
  }

  return (
    <>
      <Header />
      <main className="main" id="home">
        <section className="hero">
          <h1 className="hero-title">Your Temporary Email Address</h1>
          <p className="hero-subtitle">
            Use this address anywhere online. Messages arrive instantly with no sign-up required.
          </p>
          <EmailAddressCard
            address={mailbox?.address}
            loading={addressLoading}
            copied={copied}
            expired={expired}
            onCopy={handleCopyAddress}
          />
          <div className="hero-actions">
            <Button variant="secondary" size="md" onClick={handleNewEmail} loading={generating}>
              <PlusIcon size={16} />
              New Email
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={handleRefresh}
              disabled={!mailbox || expired}
            >
              <RefreshIcon size={16} />
              Refresh
            </Button>
          </div>
          {mailbox && (
            <ExpirationTimer
              key={mailbox.id}
              expiresAt={mailbox.expiresAt}
              expired={expired}
              onExpired={handleExpired}
            />
          )}
        </section>

        <Inbox
          emails={emails}
          loading={inboxLoading}
          refreshing={refreshing}
          generating={generating}
          error={inboxError}
          refreshDisabled={expired || !mailbox}
          onRefresh={handleRefresh}
          onDeleteInbox={openConfirm}
          onNewEmail={handleNewEmail}
          onSelect={handleOpenEmail}
        />

        <section className="how-it-works" id="how-it-works">
          <h2 className="section-title">How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num" aria-hidden="true">
                1
              </div>
              <h3>Copy your address</h3>
              <p>Generate a temporary address and copy it with one click.</p>
            </div>
            <div className="step">
              <div className="step-num" aria-hidden="true">
                2
              </div>
              <h3>Use it anywhere</h3>
              <p>Sign up for websites and services without exposing your real email.</p>
            </div>
            <div className="step">
              <div className="step-num" aria-hidden="true">
                3
              </div>
              <h3>Read &amp; let it expire</h3>
              <p>View your messages, then let the mailbox delete itself automatically.</p>
            </div>
          </div>
        </section>
      </main>

      <Modal open={detailOpen} onClose={closeDetail} size="lg" ariaLabel="Email message" showCloseButton={false}>
        <EmailDetail
          email={selectedEmail}
          mailbox={mailbox}
          loading={detailLoading}
          onBack={closeDetail}
          onDelete={handleDeleteEmail}
          onCopySender={() => copyToClipboard(selectedEmail?.senderEmail, 'Sender address copied')}
          onCopyAddress={() => copyToClipboard(mailbox?.address, 'Email address copied')}
        />
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete your inbox?"
        message="All emails in this temporary inbox will be permanently deleted."
        confirmLabel="Delete inbox"
        onConfirm={handleDeleteInbox}
        onCancel={closeConfirm}
        busy={deletingInbox}
      />

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}

export default Home
