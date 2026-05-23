import "../style/MessageBox.css";

export default function MessageBox({ visible, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) {
  if (!visible) return null;

  return (
    <div className="msgbox-overlay" role="dialog" aria-modal="true">
      <div className="msgbox-card">
        <header className="msgbox-header">
          <h3>{title}</h3>
        </header>

        <div className="msgbox-body">
          <p>{message}</p>
        </div>

        <footer className="msgbox-actions">
          <button type="button" className="msgbox-cancel" onClick={onCancel}>{cancelText}</button>
          <button type="button" className="msgbox-confirm" onClick={onConfirm}>{confirmText}</button>
        </footer>
      </div>
    </div>
  );
}
