
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  closeOnOutsideClick = true,
}) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember the element focused before opening.
    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog.
    const dialog = dialogRef.current;
    const firstFocusable = dialog?.querySelector(
      "button:not(:disabled), input:not(:disabled), " +
      "textarea:not(:disabled), select:not(:disabled), " +
      "a[href], [tabindex]:not([tabindex='-1'])"
    );

    (firstFocusable || dialog)?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      // Keep keyboard focus inside the modal.
      if (event.key === "Tab" && dialog) {
        const focusableElements = Array.from(
          dialog.querySelectorAll(
            "button:not(:disabled), input:not(:disabled), " +
            "textarea:not(:disabled), select:not(:disabled), " +
            "a[href], [tabindex]:not([tabindex='-1'])"
          )
        ).filter((element) => element.getClientRects().length > 0);

        if (focusableElements.length === 0) {
          event.preventDefault();
          dialog.focus();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      // Restore focus to the element that opened the modal.
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          closeOnOutsideClick &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        className={`modal-dialog modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-label={title ? undefined : "Dialog"}
        tabIndex={-1}
      >
        <header className="modal-header">
          {title && <h2 id="modal-title">{title}</h2>}

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </header>

        <div className="modal-content">{children}</div>
      </section>
    </div>,
    document.body
  );
}
