// src/pages/Game.jsx
import React, { useMemo, useState } from "react";

const SCENARIOS = [
  {
    id: 1,
    phase: "The Final Hour",
    title: "Missiles Discovered",
    date: "October 14, 1962",
    briefing:
      "U-2 reconnaissance photography confirms Soviet nuclear missile sites under construction in Cuba. The discovery creates immediate pressure on the White House to act before the weapons become operational.",
    options: [
      {
        id: "airstrike",
        title: "Launch Immediate Airstrikes",
        text: "Destroy the missile sites before they become operational. Quick, decisive military action.",
        tension: 28,
        diplomacy: -18,
      },
      {
        id: "blockade",
        title: "Establish Naval Blockade",
        text: "Create a quarantine around Cuba to prevent more weapons from arriving. Show strength without firing first.",
        tension: 14,
        diplomacy: 10,
      },
      {
        id: "backchannel",
        title: "Open Secret Negotiations",
        text: "Contact the Kremlin through back channels. Try to find a deal before the public learns about the missiles.",
        tension: 4,
        diplomacy: 20,
      },
      {
        id: "invasion",
        title: "Prepare Full Ground Invasion",
        text: "Mobilize troops in Florida for a full-scale invasion of Cuba to remove both missiles and Castro.",
        tension: 34,
        diplomacy: -24,
      },
    ],
  },
  {
    id: 2,
    phase: "Naval Confrontation",
    title: "Soviet Ships Approach",
    date: "October 22, 1962",
    briefing:
      "The quarantine line is set. Soviet cargo ships continue toward the Caribbean, and the world watches to see whether either side blinks.",
    options: [
      {
        id: "hold-line",
        title: "Hold the Quarantine Line",
        text: "Maintain the blockade and force Soviet captains to decide whether they will challenge the U.S. Navy.",
        tension: 16,
        diplomacy: 8,
      },
      {
        id: "warning-shot",
        title: "Authorize Warning Shots",
        text: "Signal resolve with limited force if Soviet vessels refuse instructions.",
        tension: 26,
        diplomacy: -10,
      },
      {
        id: "public-address",
        title: "Address the Nation Again",
        text: "Speak directly to the public and allies to build support and frame the crisis as defensive.",
        tension: 8,
        diplomacy: 11,
      },
      {
        id: "trade-offer",
        title: "Offer Private Missile Trade",
        text: "Explore a private bargain involving U.S. missiles in Turkey in exchange for Soviet withdrawal.",
        tension: 5,
        diplomacy: 22,
      },
    ],
  },
  {
    id: 3,
    phase: "Critical Decision",
    title: "A Way Out",
    date: "October 27, 1962",
    briefing:
      "A private channel suggests Moscow may remove the missiles if Washington offers security guarantees and quietly removes Jupiter missiles from Turkey.",
    options: [
      {
        id: "accept-secret",
        title: "Accept the Secret Deal",
        text: "Privately accept the arrangement and preserve public leverage while defusing the crisis.",
        tension: -8,
        diplomacy: 28,
      },
      {
        id: "reject-demand",
        title: "Reject the Demand",
        text: "Refuse any concession that appears weak and insist on unilateral Soviet withdrawal.",
        tension: 22,
        diplomacy: -12,
      },
      {
        id: "invade-now",
        title: "Issue Invasion Orders",
        text: "Conclude diplomacy has failed and move toward military resolution before Soviet control expands.",
        tension: 40,
        diplomacy: -30,
      },
      {
        id: "delay-response",
        title: "Delay for Verification",
        text: "Seek more intelligence and slow the pace of escalation while messages continue.",
        tension: 6,
        diplomacy: 8,
      },
    ],
  },
];

const COLORS = {
  bg: "#030406",
  panel: "#07090d",
  border: "rgba(255, 120, 120, 0.14)",
  text: "#f3dbdb",
  muted: "#8f8282",
  accent: "#f07a7a",
  accent2: "#ff9f9f",
  fill: "#b63f3f",
  danger: "#ff5e5e",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Game() {
  const [index, setIndex] = useState(0);
  const [tension, setTension] = useState(32);
  const [diplomacy, setDiplomacy] = useState(48);
  const [history, setHistory] = useState([]);
  const [selectedEnding, setSelectedEnding] = useState(null);

  const scenario = SCENARIOS[index];

  const status = useMemo(() => {
    if (selectedEnding) return selectedEnding;
    if (tension >= 100) {
      return {
        title: "Nuclear Exchange",
        text: "Escalation has crossed the point of control. The crisis ends in catastrophe.",
      };
    }
    if (index >= SCENARIOS.length) {
      if (diplomacy >= 70 && tension < 80) {
        return {
          title: "Diplomatic Resolution",
          text: "A tense compromise prevents war and allows both sides to step back.",
        };
      }
      if (tension >= 80) {
        return {
          title: "Armed Standoff",
          text: "War is avoided, but the confrontation ends with the world on the brink.",
        };
      }
      return {
        title: "Managed Crisis",
        text: "The crisis cools gradually through caution, pressure, and limited compromise.",
      };
    }
    return null;
  }, [selectedEnding, tension, diplomacy, index]);

  const chooseOption = (option) => {
    const nextTension = clamp(tension + option.tension, 0, 100);
    const nextDiplomacy = clamp(diplomacy + option.diplomacy, 0, 100);

    const entry = {
      round: scenario.title,
      choice: option.title,
      tension: nextTension,
      diplomacy: nextDiplomacy,
    };

    setHistory((prev) => [...prev, entry]);
    setTension(nextTension);
    setDiplomacy(nextDiplomacy);

    if (nextTension >= 100) {
      setSelectedEnding({
        title: "Nuclear Exchange",
        text: "Escalation reached maximum tension. The final decision chain ended in disaster.",
      });
      return;
    }

    if (index === SCENARIOS.length - 1) {
      if (nextDiplomacy >= 70 && nextTension < 80) {
        setSelectedEnding({
          title: "Diplomatic Resolution",
          text: "Back-channel bargaining and controlled force produce a fragile but lasting exit.",
        });
      } else if (nextTension >= 80) {
        setSelectedEnding({
          title: "Armed Standoff",
          text: "The missiles are addressed, but only after the superpowers come dangerously close to war.",
        });
      } else {
        setSelectedEnding({
          title: "Managed Crisis",
          text: "No clean victory emerges, but discipline prevents the crisis from becoming irreversible.",
        });
      }
      setIndex((prev) => prev + 1);
      return;
    }

    setIndex((prev) => prev + 1);
  };

  const restart = () => {
    setIndex(0);
    setTension(32);
    setDiplomacy(48);
    setHistory([]);
    setSelectedEnding(null);
  };

  const progress = Math.round((Math.min(index, SCENARIOS.length) / SCENARIOS.length) * 100);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.kicker}>
              {scenario ? scenario.phase : "Crisis Complete"}
            </div>
            <h1 style={styles.title}>
              {scenario ? scenario.title : status?.title || "Final Outcome"}
            </h1>
            <div style={styles.date}>
              {scenario ? scenario.date : "October 1962"}
            </div>
          </div>

          <div style={styles.headerSide}>
            <div style={styles.metricBox}>
              <span style={styles.metricLabel}>Tension</span>
              <span style={styles.metricValue}>{tension}%</span>
            </div>
            <div style={styles.metricBox}>
              <span style={styles.metricLabel}>Diplomacy</span>
              <span style={styles.metricValue}>{diplomacy}%</span>
            </div>
          </div>
        </header>

        <section style={styles.topGrid}>
          <div style={styles.briefingPanel}>
            <div style={styles.panelLabel}>Situation Briefing</div>
            <p style={styles.briefingText}>
              {scenario?.briefing ||
                status?.text ||
                "No briefing text was provided for this round, so a fallback summary is shown here to keep the game screen usable."}
            </p>

            <div style={styles.progressWrap}>
              <div style={styles.progressRow}>
                <span style={styles.progressLabel}>Crisis Progress</span>
                <span style={styles.progressValue}>{progress}%</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div style={styles.sidePanel}>
            <div style={styles.panelLabel}>Decision Log</div>
            {history.length === 0 ? (
              <div style={styles.emptyState}>No decisions made yet.</div>
            ) : (
              history.slice(-4).reverse().map((item, idx) => (
                <div key={`${item.choice}-${idx}`} style={styles.logItem}>
                  <div style={styles.logRound}>{item.round}</div>
                  <div style={styles.logChoice}>{item.choice}</div>
                  <div style={styles.logMeta}>
                    Tension {item.tension}% · Diplomacy {item.diplomacy}%
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {scenario && !selectedEnding ? (
          <section style={styles.cardsGrid}>
            {scenario.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => chooseOption(option)}
                style={styles.choiceCard}
              >
                <div style={styles.choiceTitle}>{option.title}</div>
                <div style={styles.choiceText}>{option.text}</div>
              </button>
            ))}
          </section>
        ) : (
          <section style={styles.endingPanel}>
            <div style={styles.panelLabel}>Outcome</div>
            <h2 style={styles.endingTitle}>{status?.title}</h2>
            <p style={styles.endingText}>{status?.text}</p>
            <button type="button" onClick={restart} style={styles.restartButton}>
              Restart Crisis
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(133, 16, 16, 0.16), transparent 24%), #030406",
    color: COLORS.text,
    fontFamily:
      "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 24,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    color: COLORS.accent,
    marginBottom: 10,
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 4rem)",
    lineHeight: 0.96,
    textTransform: "uppercase",
    color: COLORS.accent2,
  },
  date: {
    marginTop: 12,
    color: COLORS.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontSize: 13,
  },
  headerSide: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  metricBox: {
    minWidth: 130,
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    padding: "14px 16px",
  },
  metricLabel: {
    display: "block",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: COLORS.muted,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    color: "#ffd0d0",
    fontWeight: 700,
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: 16,
    marginBottom: 16,
  },
  briefingPanel: {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    padding: 20,
    minHeight: 180,
  },
  sidePanel: {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    padding: 20,
  },
  panelLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: COLORS.muted,
    marginBottom: 14,
  },
  briefingText: {
    margin: 0,
    color: COLORS.text,
    lineHeight: 1.8,
    fontSize: 16,
    minHeight: 80,
  },
  progressWrap: {
    marginTop: 20,
  },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 13,
  },
  progressLabel: {
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  progressValue: {
    color: "#ffd0d0",
  },
  progressTrack: {
    height: 12,
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${COLORS.fill}, ${COLORS.accent2})`,
  },
  emptyState: {
    color: COLORS.muted,
    fontSize: 14,
  },
  logItem: {
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  logRound: {
    color: "#ffb3b3",
    fontSize: 13,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  logChoice: {
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 4,
  },
  logMeta: {
    color: COLORS.muted,
    fontSize: 13,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  choiceCard: {
    background: "#05070b",
    border: `1px solid ${COLORS.border}`,
    padding: 20,
    textAlign: "left",
    color: COLORS.text,
    cursor: "pointer",
    minHeight: 170,
  },
  choiceTitle: {
    textTransform: "uppercase",
    color: COLORS.accent2,
    fontSize: 18,
    lineHeight: 1.2,
    marginBottom: 14,
    fontWeight: 700,
  },
  choiceText: {
    color: "#c8b7b7",
    lineHeight: 1.7,
    fontSize: 15,
  },
  endingPanel: {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    padding: 24,
  },
  endingTitle: {
    margin: "0 0 12px",
    color: COLORS.accent2,
    textTransform: "uppercase",
    fontSize: 32,
  },
  endingText: {
    color: COLORS.text,
    lineHeight: 1.8,
    maxWidth: 700,
    marginBottom: 20,
  },
  restartButton: {
    background: COLORS.accent,
    color: "#120909",
    border: "none",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
};
