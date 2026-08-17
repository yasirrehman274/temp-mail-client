import EmailListItem from './EmailListItem.jsx'

function EmailList({ emails = [], onSelect }) {
  return (
    <ul className="email-list">
      {emails.map((email) => (
        <EmailListItem key={email.id} email={email} onClick={() => onSelect(email)} />
      ))}
    </ul>
  )
}

export default EmailList
