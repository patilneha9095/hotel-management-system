function EmptyState({
  title = "No data found",
  message = "There is nothing to display here.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        📭
      </div>

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;