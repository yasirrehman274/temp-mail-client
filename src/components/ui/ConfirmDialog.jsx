import { AlertIcon } from '../icons.jsx'
import Button from './Button.jsx'
import Modal from './Modal.jsx'

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
}) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="confirm-dialog-title" size="sm">
      <div className="confirm-dialog">
        <div className="confirm-icon" aria-hidden="true">
          <AlertIcon size={22} />
        </div>
        <h3 id="confirm-dialog-title">{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
