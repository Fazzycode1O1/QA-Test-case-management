import Modal from './Modal';

export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Delete', isDestructive = true }) {
  return (
    <Modal title="Confirm Action" onClose={onCancel} size="sm">
      <p style={{ margin: 0, color: '#3d4b45', fontSize: '0.97rem' }}>{message}</p>
      <div className="form-actions" style={{ marginTop: 0 }}>
        <button
          type="button"
          className={`button ${isDestructive ? 'button-danger' : 'button-primary'}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
