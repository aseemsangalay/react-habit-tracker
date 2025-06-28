import React from "react";
import "./HabitChart.css";

const HabitChart = ({ habit, viewMode = "chart", onViewModeChange }) => {
  if (!habit || !habit.logs.length) {
    return (
      <div className="habit-chart-container">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Progress Chart</h3>
            <p className="chart-subtitle">
              Visualize your {habit?.name} progress
            </p>
          </div>
          <div className="empty-chart">
            <div className="empty-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
            </div>
            <p className="empty-text">No data to display</p>
            <p className="empty-subtext">
              Start logging your {habit?.name} to see your progress
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Process data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  });

  const chartData = last30Days.map((date) => {
    const log = habit.logs.find((log) => log.date === date);
    return {
      date,
      count: log ? log.count : 0,
      hasData: !!log,
    };
  });

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const totalCount = habit.logs.reduce((sum, log) => sum + log.count, 0);
  const activeDays = habit.logs.length;

  // Set a fixed scale for the chart - each unit represents one count
  // Use a reasonable maximum height (e.g., 10 units) or the actual max count, whichever is higher
  const chartMaxHeight = Math.max(maxCount, 10);
  const chartHeight = 200; // Fixed chart height in pixels
  const unitHeight = chartHeight / chartMaxHeight; // Height per unit

  // Prepare x-axis labels - only show key dates (every 5th day)
  const dateLabels = chartData.map((d, index) => {
    if (index % 5 === 0 || index === chartData.length - 1) {
      const dateObj = new Date(d.date);
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return "";
  });

  // Heatmap data processing
  const generateHeatmapData = () => {
    const heatmapData = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Group data by day of week
    const weeklyData = {};
    daysOfWeek.forEach((day) => (weeklyData[day] = []));

    chartData.forEach((data, index) => {
      const date = new Date(data.date);
      const dayOfWeek = daysOfWeek[date.getDay()];
      weeklyData[dayOfWeek].push(data.count);
    });

    // Calculate average for each day of week
    daysOfWeek.forEach((day) => {
      const counts = weeklyData[day];
      const average =
        counts.length > 0
          ? counts.reduce((a, b) => a + b, 0) / counts.length
          : 0;
      heatmapData.push({
        day,
        average: Math.round(average * 10) / 10,
        intensity: Math.min(average / maxCount, 1),
      });
    });

    return heatmapData;
  };

  // Circular progress data
  const calculateCircularProgress = () => {
    const goal = Math.max(maxCount * 7, 20); // Weekly goal
    const progress = Math.min(totalCount / goal, 1);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);

    return {
      progress: Math.round(progress * 100),
      strokeDasharray,
      strokeDashoffset,
      goal,
      totalCount,
    };
  };

  const renderChart = () => (
    <div className="chart-content">
      <div className="chart-bars" style={{ height: `${chartHeight}px` }}>
        {chartData.map((data, index) => (
          <div
            key={data.date}
            className={`chart-bar ${data.hasData ? "has-data" : "no-data"}`}
            style={{
              height: data.hasData ? `${data.count * unitHeight}px` : "0",
              minHeight: data.hasData ? "4px" : "0",
            }}
            title={`${dateLabels[index]}: ${data.count} ${habit.name}`}
          >
            {data.hasData && (
              <div className="bar-tooltip">
                <span className="tooltip-date">
                  {new Date(data.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="tooltip-count">{data.count}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chart-axis">
        <div className="axis-labels">
          {dateLabels.map((label, idx) => (
            <span key={idx} className={label ? "axis-label" : "axis-spacer"}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHeatmap = () => {
    const heatmapData = generateHeatmapData();

    return (
      <div className="heatmap-content">
        <div className="heatmap-grid">
          {heatmapData.map((item, index) => (
            <div key={index} className="heatmap-cell">
              <div
                className="heatmap-intensity"
                style={{
                  backgroundColor: `rgba(255, 222, 89, ${
                    item.intensity * 0.8
                  })`,
                  border: `1px solid rgba(255, 222, 89, ${
                    item.intensity * 0.3
                  })`,
                }}
              >
                <span className="heatmap-day">{item.day}</span>
                <span className="heatmap-value">{item.average}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span>Low</span>
          <div className="legend-gradient"></div>
          <span>High</span>
        </div>
      </div>
    );
  };

  const renderCircular = () => {
    const circularData = calculateCircularProgress();

    return (
      <div className="circular-content">
        <div className="circular-progress">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="rgba(38, 38, 38, 0.3)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circularData.strokeDasharray}
              strokeDashoffset={circularData.strokeDashoffset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="circular-text">
            <div className="circular-percentage">{circularData.progress}%</div>
            <div className="circular-label">Complete</div>
          </div>
        </div>
        <div className="circular-stats">
          <div className="circular-stat">
            <span className="stat-number">{circularData.totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="circular-stat">
            <span className="stat-number">{circularData.goal}</span>
            <span className="stat-label">Goal</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="habit-chart-container">
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-section">
            <h3 className="chart-title">Progress Chart</h3>
            <p className="chart-subtitle">Last 30 days of {habit.name}</p>
          </div>
          <div className="chart-controls">
            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === "chart" ? "active" : ""}`}
                onClick={() => onViewModeChange("chart")}
                title="Bar Chart"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </button>
              <button
                className={`view-btn ${viewMode === "heatmap" ? "active" : ""}`}
                onClick={() => onViewModeChange("heatmap")}
                title="Heatmap"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                className={`view-btn ${
                  viewMode === "circular" ? "active" : ""
                }`}
                onClick={() => onViewModeChange("circular")}
                title="Circular Progress"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </button>
            </div>
            <div className="chart-stats">
              <div className="stat-item">
                <span className="stat-value">{totalCount}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{activeDays}</span>
                <span className="stat-label">Days</span>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "chart" && renderChart()}
        {viewMode === "heatmap" && renderHeatmap()}
        {viewMode === "circular" && renderCircular()}

        <div className="chart-footer">
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot has-data"></div>
              <span>Logged</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot no-data"></div>
              <span>No entry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitChart;
