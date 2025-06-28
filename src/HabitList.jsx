import React, { useState } from "react";

/**
 * HabitList Component
 *
 * Displays all habits as tabs and allows adding new habits.
 * Features:
 * - Tab-based habit selection
 * - Add new habit form
 * - Responsive design
 * - Clean, minimal UI
 */
export default function HabitList({
  habits,
  selectedHabitId,
  onSelect,
  onAdd,
}) {
  const [newHabit, setNewHabit] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAdd(newHabit.trim());
      setNewHabit("");
    }
  };

  return (
    <div className="habit-list">
      <div className="habit-tabs">
        {habits.map((habit) => (
          <button
            key={habit.id}
            className={`habit-tab${
              habit.id === selectedHabitId ? " selected" : ""
            }`}
            onClick={() => onSelect(habit.id)}
            aria-pressed={habit.id === selectedHabitId}
          >
            {habit.habitName}
          </button>
        ))}
        <form onSubmit={handleAdd} className="habit-add-form">
          <input
            type="text"
            className="input habit-add-input"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add habit..."
            maxLength={32}
            aria-label="New habit name"
          />
          <button
            type="submit"
            className="button habit-add-btn"
            aria-label="Add new habit"
          >
            +
          </button>
        </form>
      </div>
    </div>
  );
}
