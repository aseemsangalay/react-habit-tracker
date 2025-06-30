import React, { useState, useEffect } from "react";
import "./Layout.css";

/**
 * MainGrid: Defines the 2-column dashboard layout (responsive)
 * LeftPanel: Logging panel (form, streak badge)
 * RightPanel: Charts, streaks, recent activity
 */
function getTodayString() {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

const Layout = ({
  children,
  currentStreak = 0,
  demoMode = false,
  onToggleDemoMode,
  onEnableDemoMode,
}) => {
  const [todayString, setTodayString] = useState(getTodayString());
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const updateDateTime = () => {
      setTodayString(getTodayString());
      setCurrentTime(getCurrentTime());
    };

    // Update every second
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="branding-header">
        <div className="navbar-container">
          {/* Left Side Branding */}
          <div className="branding-section">
            <div className="branding-title">TRACE</div>
            <div className="branding-subtitle">Track. Reflect. Compound.</div>
          </div>
          {/* Right Side: Today, Theme Toggle, Avatar */}
          <div className="navbar-right-group">
            <div className="navbar-today">
              Today: {todayString} • {currentTime}
            </div>
            {/* Demo Mode Pill/Button Logic */}
            {demoMode ? (
              <button
                className="demo-pill demo-on"
                onClick={onToggleDemoMode}
                title="Click to turn off demo mode"
                type="button"
              >
                Demo Mode: ON
              </button>
            ) : (
              <button
                className="demo-pill try-demo-btn"
                onClick={onEnableDemoMode}
                title="Try Demo with Mock Data"
                type="button"
              >
                Try Demo
              </button>
            )}
            <button
              className="demo-pill clear-data-btn"
              onClick={() => {
                localStorage.removeItem("trace-habits-v1");
                window.location.reload();
              }}
              title="Clear all saved habit data"
              type="button"
            >
              Clear Data
            </button>
            <button
              className="theme-toggle-btn"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41" />
              </svg>
            </button>
            <div className="navbar-avatar" title="User">
              {/* Minimal user SVG icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8.5" r="4.2" />
                <path d="M4.5 20c0-3.1 3.1-5.5 7.5-5.5s7.5 2.4 7.5 5.5" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      <div className="dashboard-root">
        {/* MainGrid: 2-column responsive dashboard */}
        <div className="dashboard-main-grid">{children}</div>
      </div>
    </>
  );
};

export default Layout;
