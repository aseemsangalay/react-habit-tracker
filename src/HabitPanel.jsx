import React, { useState } from "react";
import "./HabitPanel.css";

const HabitPanel = ({
  habits = [],
  activeHabit,
  onHabitSelect,
  onAddHabit,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName("");
      setShowModal(false);
    }
  };

  // Ensure habits is always an array
  const safeHabits = Array.isArray(habits) ? habits : [];

  return (
    <div className="habit-panel">
      <div className="habit-tabs">
        {safeHabits.map((habit) => (
          <button
            key={habit.id}
            className={`habit-tab ${
              activeHabit?.id === habit.id ? "active" : ""
            }`}
            onClick={() => onHabitSelect(habit)}
          >
            <span className="habit-name">{habit.name}</span>
            <span className="habit-count">{habit.logs?.length || 0}</span>
          </button>
        ))}

        <button className="add-habit-btn" onClick={() => setShowModal(true)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>New Habit</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Habit</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="modal-form">
              <div className="form-group">
                <label htmlFor="habit-name" className="form-label">
                  Habit Name
                </label>
                <input
                  id="habit-name"
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="form-input"
                  placeholder="e.g., Read 30 minutes"
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!newHabitName.trim()}
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitPanel;
