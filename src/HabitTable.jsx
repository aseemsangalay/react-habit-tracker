import React from "react";

/**
 * HabitTable Component
 *
 * Displays a table of habit entries with date, count, and reflection.
 * Features:
 * - Sortable by date
 * - Shows count and optional reflection
 * - Empty state when no entries
 * - Clean, minimal table design
 * - Responsive layout
 */
export default function HabitTable({ entries }) {
  const sortedEntries = [...entries].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="table-wrap">
      {sortedEntries.length === 0 ? (
        <div className="empty-state">
          <div
            className="gold-line"
            style={{ margin: "2rem auto 1.5rem auto" }}
            aria-hidden="true"
          ></div>
          <div className="empty-headline">No entries yet</div>
          <div className="empty-message">
            Start logging to see your progress.
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Count</th>
              <th>Reflection</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, i) => (
              <tr key={i}>
                <td>{entry.date}</td>
                <td>{entry.count}</td>
                <td>{entry.reflection || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
