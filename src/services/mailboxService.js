const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}, token) {
  const headers = { ...(options.headers || {}) }
  if (options.body) headers['Content-Type'] = 'application/json'
  if (token) headers['x-mailbox-token'] = token

  let response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    const error = new Error('Could not reach the server')
    error.status = 0
    throw error
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed')
    error.status = response.status
    throw error
  }

  return data
}

function parseSender(from) {
  const match = String(from || '').match(/^(.*?)\s*<([^>]+)>$/)
  if (match) {
    return { sender: match[1].trim(), senderEmail: match[2] }
  }
  return { sender: from || '', senderEmail: from || '' }
}

function toEmail(email) {
  const { sender, senderEmail } = parseSender(email.from)
  return {
    id: email.id,
    sender,
    senderEmail,
    subject: email.subject || '',
    preview: email.preview || '',
    body: email.text || '',
    html: email.html || '',
    receivedAt: email.receivedAt,
    unread: !email.isRead,
  }
}

function toMailbox(mailbox) {
  return {
    id: mailbox.id,
    address: mailbox.address,
    token: mailbox.token,
    expiresAt: mailbox.expiresAt,
    status: mailbox.status,
  }
}

export async function createMailbox() {
  const data = await request('/mailbox/create', { method: 'POST' })
  return toMailbox(data.mailbox)
}

export async function getMailbox(mailboxId, token) {
  const data = await request(`/mailbox/${mailboxId}`, {}, token)
  return toMailbox(data.mailbox)
}

export async function getMailboxEmails(mailboxId, token) {
  const data = await request(`/mailbox/${mailboxId}/emails`, {}, token)
  return data.emails.map(toEmail)
}

export async function refreshInbox(mailboxId, token) {
  return getMailboxEmails(mailboxId, token)
}

export async function getEmail(emailId, token) {
  const data = await request(`/email/${emailId}`, {}, token)
  return toEmail(data.email)
}

export async function deleteEmail(emailId, token) {
  await request(`/email/${emailId}`, { method: 'DELETE' }, token)
}

export async function deleteMailbox(mailboxId, token) {
  await request(`/mailbox/${mailboxId}`, { method: 'DELETE' }, token)
}
