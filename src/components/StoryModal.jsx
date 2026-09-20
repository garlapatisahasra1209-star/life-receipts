import {
  categoryIcons,
  formatDate,
  formatTime,
} from "../data/lifeLensUtils";

function StoryModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="story-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close story"
        >
          ×
        </button>

        <span className="modal-icon">
          {categoryIcons[item.type] || "•"}
        </span>

        <span className="section-kicker">{item.type}</span>

        <h2 id="story-modal-title">{item.title}</h2>

        <p>{item.description}</p>

        <div className="modal-details">
          <span>📅 {formatDate(item.date)}</span>
          <span>🕐 {formatTime(item.time)}</span>

          {item.location && (
            <span>📍 {item.location}</span>
          )}

          {item.amount !== undefined && (
            <span>
              💰 ₹{Number(item.amount).toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryModal;