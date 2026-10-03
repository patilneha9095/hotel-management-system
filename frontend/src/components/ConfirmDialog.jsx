function ConfirmDialog({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="dialog-overlay">
      <div className="confirm-dialog">

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="dialog-actions">

          <button
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="danger-btn"
            onClick={onConfirm}
          >
            Confirm
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;