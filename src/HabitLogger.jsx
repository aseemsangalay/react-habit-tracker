import React, { useState } from "react";

/**
 * HabitLogger Component
 *
 * Form for logging daily entries for a specific habit.
 * Features:
 * - Count input (number)
 * - Reflection input (optional text)
 * - Pre-fills with today's entry if exists
 * - Clean, minimal form design
 * - Responsive layout
 */
export default function HabitLogger({ habit, onLog, todayEntry }) {
  const today = new Date().toISOString().split("T")[0];
  const [count, setCount] = useState(todayEntry ? todayEntry.count : "");
  const [reflection, setReflection] = useState(
    todayEntry ? todayEntry.reflection : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (count === "") return;

    onLog(today, parseInt(count), reflection);

    // Reset form after successful submission
    setCount("");
    setReflection("");
  };

  return (
    <form onSubmit={handleSubmit} className="form habit-logger-form">
      <input
        type="number"
        className="input"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        placeholder={`How many for ${habit.habitName}?`}
        min="0"
        aria-label={`Count for ${habit.habitName}`}
      />
      <input
        type="text"
        className="input"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Reflection (optional)"
        maxLength={100}
        aria-label="Optional reflection"
      />
      <button type="submit" className="button">
        Log
      </button>
    </form>
  );
}
