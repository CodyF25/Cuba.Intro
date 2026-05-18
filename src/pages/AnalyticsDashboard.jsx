// src/pages/AnalyticsDashboard.jsx
import React, { useMemo, useState } from "react";

const seedRuns = [
  {
    id: 1,
    player: "Player 1",
    date: "1962-10-14",
    ending: "Diplomatic Resolution",
    score: 84,
    peakTension: 72,
    turns: 8,
    survived: true,
  },
  {
    id: 2,
    player: "Player 2",
    date: "1962-10-16",
    ending: "Naval Stand-off",
    score: 61,
    peakTension: 85,
    turns: 6,
    survived: true,
  },
  {
    id: 3,
    player: "Player 3",
    date: "1962-10-18",
    ending: "Nuclear Exchange",
    score: 12,
    peakTension: 100,
    turns: 5,
    survived: false,
  },
  {
    id: 4,
    player: "Player 4",
    date: "1962-10-20",
    ending: "Secret Deal",
    score: 91,
    peakTension: 64,
    turns: 9,
    survived: true,
  },
  {
    id: 5,
    player: "Player 5",
    date: "1962-10-22",
    ending: "Diplomatic Resolution",
    score: 77,
    peakTension: 70,
    turns: 7,
    survived: true,
  },
];

const COLORS = {
  bg: "#050608",
  panel: "#0a0d12",
  panelAlt: "#0d1117",
  border: "rgba(255, 120, 120, 0.14)",
  text: "#f2d9d9",
  muted: "#9b8b8b",
  accent: "#ef6b6b",
  accentSoft: "rgba(239, 107, 107, 0.12)",
  success: "#8dd9a0",
  warning: "#f2b36f",
  danger: "#ff5d5d",
};

function StatCard({ label, value, sub }) {
  return (
    <div style={styles.card}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

function Bar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={styles.rowBetween}>
        <span style={styles.smallLabel}>{label}</span>
        <span style={styles.smallValue}>{value}</span>
      </div>
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${pct}%`,
            background: color || COLORS.accent,
          }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [runs] = useState(seedRuns);

  const metrics = useMemo(() => {
    const totalRuns = runs.length;
    const avgScore = Math.round(
      runs.reduce((sum, run) => sum + run.score, 0) / totalRuns
    );
    const avgPeakTension = Math.round(
      runs.reduce((sum, run) => sum + run.peakTension, 0) / totalRuns
    );
    const survivalRate = Math.round(
      (runs.filter((run) => run.survived).length / totalRuns) * 100
    );

    const endingCounts = runs.reduce((acc, run) => {
      acc[run.ending] = (acc[run.ending] || 0) + 1;
      return acc;
    }, {});

    const highestScore = [...runs].sort((a, b) => b.score - a.score)[0];
    const highestTension = [...runs].sort((a, b) => b.peakTension - a.peakTension)[0];

    return {
      totalRuns,
      avgScore,
      avgPeakTension,
      survivalRate,
      endingCounts,
      highestScore,
      highestTension,
    };
  }, [runs]);

  const endingEntries = Object.entries(metrics.endingCounts);
  const maxEndingCount = Math.max(...endingEntries.map(([, count]) => count), 1);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <div style={styles.kicker}>THIRTEEN DAYS</div>
            <h1 style={styles.title}>Analytics Dashboard</h1>
            <p style={styles.subtitle}>
              Review outcomes, tension trends, and player survival patterns across simulated crisis runs.
            </p>
          </div>
          <div style={styles.badge}>Live Simulation Metrics</div>
        </header>

        <section style={styles.grid4}>
          <StatCard
            label="Total Runs"
            value={metrics.totalRuns}
            sub="Completed sessions"
          />
          <StatCard
            label="Average Score"
            value={metrics.avgScore}
            sub="Decision quality index"
          />
          <StatCard
            label="Avg Peak Tension"
            value={`${metrics.avgPeakTension}%`}
            sub="Maximum pressure reached"
          />
          <StatCard
            label="Survival Rate"
            value={`${metrics.survivalRate}%`}
            sub="Runs that avoided catastrophe"
          />
        </section>

        <section style={styles.grid2}>
          <div style={styles.panel}>
            <div style={styles.panelTitle}>Ending Distribution</div>
            <div style={{ marginTop: 18 }}>
              {endingEntries.map(([label, count], index) => (
                <Bar
                  key={label}
                  label={label}
                  value={count}
                  max={maxEndingCount}
                  color={
                    index === 0
                      ? COLORS.accent
                      : index === 1
                      ? COLORS.warning
                      : index === 2
                      ? COLORS.danger
                      : COLORS.success
                  }
                />
              ))}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}>Highlights</div>
            <div style={styles.highlightBlock}>
              <div style={styles.highlightLabel}>Best Score</div>
              <div style={styles.highlightValue}>
                {metrics.highestScore.player} — {metrics.highestScore.score}
              </div>
              <div style={styles.highlightMeta}>
                {metrics.highestScore.ending} on {metrics.highestScore.date}
              </div>
            </div>

            <div style={styles.highlightBlock}>
              <div style={styles.highlightLabel}>Highest Tension</div>
              <div style={styles.highlightValue}>
                {metrics.highestTension.player} — {metrics.highestTension.peakTension}%
              </div>
              <div style={styles.highlightMeta}>
                {metrics.highestTension.ending} after {metrics.highestTension.turns} turns
              </div>
            </div>
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelTitle}>Recent Runs</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Player</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Ending</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Peak Tension</th>
                  <th style={styles.th}>Turns</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id}>
                    <td style={styles.td}>{run.player}</td>
                    <td style={styles.td}>{run.date}</td>
                    <td style={styles.td}>{run.ending}</td>
                    <td style={styles.td}>{run.score}</td>
                    <td style={styles.td}>{run.peakTension}%</td>
                    <td style={styles.td}>{run.turns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(140,20,20,0.18), transparent 28%), #050608",
    color: COLORS.text,
    fontFamily:
      "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 24,
  },
  shell: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  kicker: {
    fontSize: 12,
    letterSpacing: "0.35em",
    color: COLORS.accent,
    marginBottom: 10,
  },
  title: {
    fontSize: "clamp(2rem, 4vw, 3.4rem)",
    lineHeight: 1,
    margin: 0,
    color: "#ff8b8b",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 720,
    color: COLORS.muted,
    lineHeight: 1.6,
  },
  badge: {
    padding: "10px 14px",
    border: `1px solid ${COLORS.border}`,
    background: COLORS.accentSoft,
    color: "#ffb0b0",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontSize: 12,
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 16,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
    marginBottom: 16,
  },
  card: {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    padding: 20,
    minHeight: 120,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: COLORS.muted,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 36,
    color: "#ffd1d1",
    marginBottom: 8,
    fontWeight: 700,
  },
  statSub: {
    color: COLORS.muted,
    fontSize: 14,
  },
  panel: {
    background: COLORS.panelAlt,
    border: `1px solid ${COLORS.border}`,
    padding: 20,
  },
  panelTitle: {
    fontSize: 20,
    textTransform: "uppercase",
    color: "#ffa0a0",
    marginBottom: 8,
    letterSpacing: "0.05em",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  smallLabel: {
    color: COLORS.text,
    fontSize: 14,
  },
  smallValue: {
    color: COLORS.muted,
    fontSize: 14,
  },
  barTrack: {
    height: 10,
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
  },
  highlightBlock: {
    padding: 16,
    background: "rgba(255,255,255,0.02)",
    border: `1px solid ${COLORS.border}`,
    marginTop: 14,
  },
  highlightLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: COLORS.muted,
    marginBottom: 8,
  },
  highlightValue: {
    fontSize: 22,
    color: "#ffd0d0",
    marginBottom: 6,
    fontWeight: 700,
  },
  highlightMeta: {
    color: COLORS.muted,
    fontSize: 14,
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    color: COLORS.muted,
    fontWeight: 600,
    borderBottom: `1px solid ${COLORS.border}`,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  td: {
    padding: "14px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    color: COLORS.text,
    fontSize: 14,
  },
};
