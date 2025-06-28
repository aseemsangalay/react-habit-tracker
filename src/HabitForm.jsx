import React, { useState } from "react";
import "./HabitForm.css";

const HabitForm = ({ habit, onLogHabit }) => {
  const [count, setCount] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reflection, setReflection] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (count > 0 && habit) {
      onLogHabit(habit.id, {
        date,
        count: parseInt(count),
        reflection: reflection.trim(),
      });
      setCount(1);
      setReflection("");
    }
  };

  // If no habit is selected, show empty state
  if (!habit) {
    return (
      <div className="habit-form-container">
        <div className="form-card">
          <div className="form-header">
            <h3 className="form-title">Log Progress</h3>
            <p className="form-subtitle">Select a habit to start tracking</p>
          </div>
          <div className="empty-form">
            <div className="empty-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <p className="empty-text">No habit selected</p>
            <p className="empty-subtext">
              Choose a habit from the panel to start tracking your progress
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="habit-form-container">
      <div className="form-card">
        <div className="form-header">
          <h3 className="form-title">Log Progress</h3>
          <p className="form-subtitle">Track your {habit.name} progress</p>
        </div>

        <form onSubmit={handleSubmit} className="habit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="count" className="form-label">
                Count / Duration
              </label>
              <input
                type="number"
                id="count"
                className="form-input"
                placeholder="Enter count or duration..."
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reflection" className="form-label">
              Reflection & Insights
            </label>
            <textarea
              id="reflection"
              className="reflection-input"
              placeholder="Reflect on your progress, insights, or breakthroughs..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
            />
          </div>

          <button type="submit" className="form-submit-btn">
            Log Progress
          </button>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
