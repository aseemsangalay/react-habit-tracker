import React, { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import HabitPanel from "./HabitPanel";
import HabitForm from "./HabitForm";
import HabitChart from "./HabitChart";
import LogHistory from "./LogHistory";
import Toast from "./Toast";
import "./App.css";

function App() {
  const [habits, setHabits] = useState([]);
  const [activeHabit, setActiveHabit] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("chart"); // 'chart', 'heatmap', 'circular'
  const [demoMode, setDemoMode] = useState(false);
  const demoDataRef = useRef(null);

  // Load habits from localStorage or mock data based on demoMode
  useEffect(() => {
    if (demoMode) {
      // If mock data hasn't been generated yet, generate and store it
      if (!demoDataRef.current) {
        demoDataRef.current = createDefaultHabit(true); // return the mock data
      }
      const mockHabits = demoDataRef.current;
      setHabits(mockHabits);
      setActiveHabit(mockHabits[0]);
      return;
    }
    // DEMO MODE OFF: Only load real data, never fallback to mock data
    const savedHabits = localStorage.getItem("trace-habits-v1");
    if (savedHabits) {
      try {
        const parsed = JSON.parse(savedHabits);
        if (parsed.habits && Array.isArray(parsed.habits)) {
          const migratedHabits = parsed.habits.map((habit) => ({
            id: habit.id,
            name: habit.habitName || habit.name || "Untitled Habit",
            logs: (habit.entries || habit.logs || []).map((entry) => ({
              date: entry.date,
              count: entry.count,
              reflection: entry.reflection || "",
            })),
          }));
          setHabits(migratedHabits);
          if (migratedHabits.length > 0) {
            setActiveHabit(migratedHabits[0]);
          } else {
            setActiveHabit(null);
          }
        } else if (Array.isArray(parsed)) {
          setHabits(parsed);
          if (parsed.length > 0) {
            setActiveHabit(parsed[0]);
          } else {
            setActiveHabit(null);
          }
        } else {
          setHabits([]);
          setActiveHabit(null);
        }
      } catch (error) {
        console.error("Failed to parse stored data:", error);
        setHabits([]);
        setActiveHabit(null);
      }
    } else {
      setHabits([]);
      setActiveHabit(null);
    }
  }, [demoMode]);

  // If returnData is true, return the mock data instead of setting state
  const createDefaultHabit = (returnData = false) => {
    const today = new Date();
    const format = (d) => d.toISOString().split("T")[0];

    // Generate realistic mock data for the last 30 days
    const generateMockLogs = (habitName, pattern) => {
      const logs = [];
      const reflections = [
        "Focused and productive session today. Building momentum.",
        "Pushed through resistance and made significant progress.",
        "Excellent consistency - the compound effect is real.",
        "Quick but effective session. Quality over quantity.",
        "In the zone today - breakthrough moment achieved.",
        "Managed to complete despite busy schedule. Adaptability wins.",
        "Strong performance - feeling the benefits of consistency.",
        "Adapted strategy due to external factors. Flexibility key.",
        "Consistent effort paying dividends. Trust the process.",
        "Challenging day but stayed committed to growth.",
        "Major breakthrough! The work is compounding.",
        "Steady progress - sustainable growth over time.",
        "Highly motivated and inspired today.",
        "Pushed beyond comfort zone. Growth mindset activated.",
        "Recovery day with lighter intensity. Smart training.",
        "Building foundational habits for long-term success.",
        "Focused on quality and precision over volume.",
        "Exceptional energy and focus throughout.",
        "Successfully adapted to unexpected changes.",
        "Tangible benefits becoming evident now.",
        "Consistency is the key to mastery.",
        "Pushed through mental barriers today.",
        "Celebrating incremental progress and wins.",
        "Learning from setbacks - growth mindset.",
        "Building unstoppable momentum daily.",
        "Process-focused approach yielding results.",
        "Trusting the journey and staying patient.",
        "Every session contributes to the bigger picture.",
        "Committed to continuous improvement.",
        "Progress over perfection - sustainable growth.",
      ];

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = format(date);

        let count = 0;
        let hasData = false;

        // Different patterns for different habits
        switch (pattern) {
          case "consistent":
            // Consistent daily habit with some variation
            if (Math.random() > 0.1) {
              // 90% completion rate
              count = Math.floor(Math.random() * 3) + 3; // 3-5 range
              hasData = true;
            }
            break;
          case "intensive":
            // Intensive habit with higher counts but some rest days
            if (Math.random() > 0.15) {
              // 85% completion rate
              count = Math.floor(Math.random() * 4) + 6; // 6-9 range
              hasData = true;
            }
            break;
          case "building":
            // Building habit - starts low, increases over time
            if (i < 20 && Math.random() > 0.2) {
              // More recent days, 80% completion
              count = Math.floor(Math.random() * 2) + 1; // 1-2 range
              hasData = true;
            }
            break;
          case "streak":
            // Streak-based habit with some gaps
            if (i % 3 !== 0 && Math.random() > 0.1) {
              // Skip every 3rd day, 90% of remaining
              count = Math.floor(Math.random() * 3) + 2; // 2-4 range
              hasData = true;
            }
            break;
        }

        if (hasData) {
          logs.push({
            date: dateStr,
            count,
            reflection:
              reflections[Math.floor(Math.random() * reflections.length)],
          });
        }
      }

      return logs;
    };

    const mockHabits = [
      {
        id: "h1",
        name: "Strategic Planning",
        logs: generateMockLogs("Strategic Planning", "consistent"),
      },
      {
        id: "h2",
        name: "Revenue Generation",
        logs: generateMockLogs("Revenue Generation", "intensive"),
      },
      {
        id: "h3",
        name: "Team Leadership",
        logs: generateMockLogs("Team Leadership", "building"),
      },
      {
        id: "h4",
        name: "Market Research",
        logs: generateMockLogs("Market Research", "streak"),
      },
      {
        id: "h5",
        name: "Investor Relations",
        logs: generateMockLogs("Investor Relations", "consistent"),
      },
    ];

    if (returnData) {
      return mockHabits;
    } else {
      setHabits(mockHabits);
      setActiveHabit(mockHabits[0]);
    }
  };

  // Save habits to localStorage whenever habits change (only if not in demo mode)
  useEffect(() => {
    if (!demoMode && habits.length > 0) {
      localStorage.setItem("trace-habits-v1", JSON.stringify(habits));
    }
  }, [habits, demoMode]);

  const addHabit = (name) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      logs: [],
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    setActiveHabit(newHabit);
    setTimeout(() => {
      document
        .querySelector(".dashboard-left-panel")
        .scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const logHabit = (habitId, logData) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const existingLogIndex = habit.logs.findIndex(
          (log) => log.date === logData.date
        );
        if (existingLogIndex !== -1) {
          const updatedLogs = [...habit.logs];
          updatedLogs[existingLogIndex] = logData;
          return { ...habit, logs: updatedLogs };
        } else {
          return { ...habit, logs: [...habit.logs, logData] };
        }
      }
      return habit;
    });
    setHabits(updatedHabits);
    setActiveHabit(updatedHabits.find((h) => h.id === habitId));
    setToast({
      message: `Logged ${logData.count} ${activeHabit?.name}`,
      type: "success",
    });
    setTimeout(() => {
      const el = document.querySelector(".history-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const resetToMockData = () => {
    setDemoMode(true);
    setToast({
      message: "Demo mode enabled with mock data",
      type: "success",
    });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Calculate current streak
  const calculateStreak = () => {
    if (!activeHabit || !activeHabit.logs.length) return 0;

    const sortedLogs = [...activeHabit.logs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    let streak = 0;
    let currentDate = new Date();

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      const daysDiff = Math.floor(
        (currentDate - logDate) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  // Set document title
  useEffect(() => {
    document.title = "TRACE - Professional Habit Tracking & Analytics";
  }, []);

  useEffect(() => {
    // If activeHabit has less than 5 logs, inject mock logs for look & feel
    if (activeHabit && activeHabit.logs.length < 5) {
      const today = new Date();
      const format = (d) => d.toISOString().split("T")[0];

      // Generate realistic mock logs for the last 30 days
      const generateMockLogs = (habitName) => {
        const logs = [];
        const reflections = [
          "Focused and productive session today. Building momentum.",
          "Pushed through resistance and made significant progress.",
          "Excellent consistency - the compound effect is real.",
          "Quick but effective session. Quality over quantity.",
          "In the zone today - breakthrough moment achieved.",
          "Managed to complete despite busy schedule. Adaptability wins.",
          "Strong performance - feeling the benefits of consistency.",
          "Adapted strategy due to external factors. Flexibility key.",
          "Consistent effort paying dividends. Trust the process.",
          "Challenging day but stayed committed to growth.",
          "Major breakthrough! The work is compounding.",
          "Steady progress - sustainable growth over time.",
          "Highly motivated and inspired today.",
          "Pushed beyond comfort zone. Growth mindset activated.",
          "Recovery day with lighter intensity. Smart training.",
          "Building foundational habits for long-term success.",
          "Focused on quality and precision over volume.",
          "Exceptional energy and focus throughout.",
          "Successfully adapted to unexpected changes.",
          "Tangible benefits becoming evident now.",
          "Consistency is the key to mastery.",
          "Pushed through mental barriers today.",
          "Celebrating incremental progress and wins.",
          "Learning from setbacks - growth mindset.",
          "Building unstoppable momentum daily.",
          "Process-focused approach yielding results.",
          "Trusting the journey and staying patient.",
          "Every session contributes to the bigger picture.",
          "Committed to continuous improvement.",
          "Progress over perfection - sustainable growth.",
        ];

        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = format(date);

          // Generate realistic pattern
          if (Math.random() > 0.15) {
            // 85% completion rate
            const count = Math.floor(Math.random() * 4) + 2; // 2-5 range
            logs.push({
              date: dateStr,
              count,
              reflection:
                reflections[Math.floor(Math.random() * reflections.length)],
            });
          }
        }

        return logs;
      };

      const mockLogs = generateMockLogs(activeHabit.name);
      setHabits(
        habits.map((h) =>
          h.id === activeHabit.id ? { ...h, logs: mockLogs } : h
        )
      );
    }
  }, [activeHabit]);

  return (
    <Layout
      currentStreak={currentStreak}
      demoMode={demoMode}
      onToggleDemoMode={() => setDemoMode((d) => !d)}
      onEnableDemoMode={resetToMockData}
    >
      {/* MainGrid: 2-column dashboard layout (see Layout.jsx) */}
      {/* LeftPanel: Logging panel (form, streak badge) */}
      <div className="dashboard-left-panel">
        <HabitPanel
          habits={habits}
          activeHabit={activeHabit}
          onHabitSelect={setActiveHabit}
          onAddHabit={addHabit}
        />
        <div style={{ position: "relative" }}>
          {/* Streak badge in top-right of form card */}
          <div className="streak-badge-floating">
            <span className="streak-count">{currentStreak}</span>
            <span className="streak-label">day streak</span>
          </div>
          <HabitForm habit={activeHabit} onLogHabit={logHabit} />
        </div>
      </div>
      {/* RightPanel: Charts, streaks, recent activity */}
      <div className="dashboard-right-panel">
        <HabitChart
          habit={activeHabit}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
        <LogHistory habit={activeHabit} />
      </div>
      {/* Toast Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </Layout>
  );
}

export default App;
