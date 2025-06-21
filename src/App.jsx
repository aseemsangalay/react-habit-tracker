import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./App.css";

export default function App() {
  const [entries, setEntries] = useState(() => {
    const stored = localStorage.getItem("habitData");
    return stored ? JSON.parse(stored) : [];
  });

  const [count, setCount] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    localStorage.setItem("habitData", JSON.stringify(entries));
  }, [entries]);

  // Calculate current streak
  function getStreak(entries) {
    if (!entries.length) return 0;
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    let current = new Date(sorted[0].date);
    for (let i = 0; i < sorted.length; i++) {
      const entryDate = new Date(sorted[i].date);
      if (entryDate.toDateString() === current.toDateString()) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  const streak = getStreak(entries);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!count || !date) return;
    const existing = entries.find((e) => e.date === date);
    let newEntries;
    if (existing) {
      newEntries = entries.map((e) =>
        e.date === date ? { ...e, count: parseInt(count) } : e
      );
    } else {
      newEntries = [...entries, { date, count: parseInt(count) }];
    }
    setEntries(newEntries);
    setCount("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // Sort entries by date ascending for table and chart
  const sortedEntries = [...entries].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="container">
      <div className="gold-line" aria-hidden="true"></div>
      <h1 className="title">Habit System Tracker</h1>
      <div className="subtitle">
        Leverage clarity. Build legacy. Impact through systems, not streaks.
      </div>
      <div className="streak-bar">
        Current System Streak: <span className="streak-count">{streak}</span>{" "}
        day{streak !== 1 ? "s" : ""}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="date"
          className="input input-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
        <input
          type="number"
          className="input"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="How many videos?"
          min="0"
        />
        <button type="submit" className="button">
          Add / Edit
        </button>
      </form>
      <div className="data-row">
        <div className="table-wrap">
          {sortedEntries.length === 0 ? (
            <div className="empty-state">
              <div
                className="gold-line"
                style={{ margin: "2rem auto 1.5rem auto" }}
                aria-hidden="true"
              ></div>
              <div className="empty-headline">Begin Your System</div>
              <div className="empty-message">
                Leverage clarity. Add your first entry to start building your
                legacy.
              </div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Videos</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((e, i) => (
                  <tr key={i}>
                    <td>{e.date}</td>
                    <td>{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="chart">
          <LineChart width={300} height={300} data={sortedEntries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#D4AF37"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
