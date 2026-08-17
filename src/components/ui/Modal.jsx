import { useEffect, useRef } from 'react'
import { CloseIcon } from '../icons.jsx'

function Modal({
  open,
  onClose,
  ariaLabel,
  labelledBy,
  size = 'md',
  showCloseButton = true,
  children,
}) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    previousFocusRef.current = document.activeElement
    dialogRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const labelProps = labelledBy
    ? { 'aria-labelledby': labelledBy }
    : ariaLabel
      ? { 'aria-label': ariaLabel }
      : {}

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={`modal modal-${size}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        {...labelProps}
      >
        {showCloseButton && (
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
