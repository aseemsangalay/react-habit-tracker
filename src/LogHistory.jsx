import React from "react";
import "./LogHistory.css";

const LogHistory = ({ habit }) => {
  if (!habit || !habit.logs.length) {
    return (
      <div className="log-history-container">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">Recent Activity</h3>
          </div>
          <div className="empty-history">
            <div className="empty-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="empty-text">No activity yet</p>
            <p className="empty-subtext">
              Your logged entries will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sortedLogs = [...habit.logs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="log-history-container">
      <div className="history-card">
        <div className="history-header">
          <h3 className="history-title">Recent Activity</h3>
          <span className="history-count">{habit.logs.length} entries</span>
        </div>

        <div className="history-content">
          <div className="history-table">
            <div className="table-header">
              <div className="header-cell">Date</div>
              <div className="header-cell">Count</div>
              <div className="header-cell">Reflection</div>
            </div>

            <div className="table-body">
              {sortedLogs.slice(0, 10).map((log, index) => (
                <div key={`${log.date}-${index}`} className="table-row">
                  <div className="table-cell date-cell">
                    <span className="date-text">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="date-year">
                      {new Date(log.date).getFullYear()}
                    </span>
                  </div>

                  <div className="table-cell count-cell">
                    <span className="count-badge">{log.count}</span>
                  </div>

                  <div className="table-cell reflection-cell">
                    {log.reflection ? (
                      <span className="reflection-text">{log.reflection}</span>
                    ) : (
                      <span className="no-reflection">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {habit.logs.length > 10 && (
            <div className="history-footer">
              <span className="more-entries">
                +{habit.logs.length - 10} more entries
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogHistory;
