import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ROUNDS } from "@/lib/gameData";
import DecisionCard from "@/components/game/DecisionCard";
import HistoricalTicker from "@/components/game/HistoricalTicker";
import DEFCONMeter from "@/components/game/DEFCONMeter";
import CountdownClock from "@/components/game/CountdownClock";
import EndingScreen from "@/components/game/EndingScreen";
import NuclearWarScreen from "@/components/game/NuclearWarScreen";

function createSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getEndingFromScore(score) {
  if (score <= -3) return "nuclear";
  if (score <= 1) return "humiliation";
  if (score <= 5) return "aggressive_peace";
  return "peace";
}

export default function Game() {
  const navigate = useNavigate();

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [endingType, setEndingType] = useState(null);
  const [analyticsError, setAnalyticsError] = useState("");
  const [sessionId] = useState(() => createSessionId());

  const isMountedRef = useRef(true);
  const hasLoggedEndingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const round = ROUNDS?.[currentRound];

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const defconLevel = useMemo(() => {
    if (score <= -3) return 1;
    if (score <= -1) return 2;
    if (score <= 2) return 3;
    if (score <= 5) return 4;
    return 5;
  }, [score]);

  async function saveAnalyticsRow(payload) {
    if (!base44?.entities?.GameAnalytics) {
      throw new Error("GameAnalytics entity not found");
    }

    return base44.entities.GameAnalytics.create(payload);
  }

  async function logChoice(roundIndex, option) {
    await saveAnalyticsRow({
      session_id: sessionId,
      round_id: roundIndex,
      option_id: option?.id ?? null,
      option_label: option?.label ?? option?.text ?? "Unknown Choice",
      ending_type: null,
    });
  }

  async function logEnding(finalEndingType) {
    if (hasLoggedEndingRef.current) return;

    hasLoggedEndingRef.current = true;

    await saveAnalyticsRow({
      session_id: sessionId,
      round_id: null,
      option_id: null,
      option_label: null,
      ending_type: finalEndingType,
    });
  }

  const finishGame = async (finalEndingType) => {
    await logEnding(finalEndingType);

    if (!isMountedRef.current) return;

    setEndingType(finalEndingType);
    setGameOver(true);
    setShowTransition(false);
  };

  const handleSelectOption = async (option) => {
    if (!round || gameOver || showTransition || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setAnalyticsError("");
    setSelectedOption(option);
    setShowTransition(true);

    try {
      const roundIndex = currentRound;
      const scoreDelta = Number(option?.score ?? 0);
      const nextScore = score + scoreDelta;
      const isLastRound = roundIndex === ROUNDS.length - 1;

      await logChoice(roundIndex, option);
      setScore(nextScore);

      const forcedEnding = option?.ending_type || null;
      const nuclearEnding = nextScore <= -3 ? "nuclear" : null;

      if (forcedEnding || nuclearEnding) {
        const resolvedEnding = forcedEnding || nuclearEnding;

        setTimeout(() => {
          finishGame(resolvedEnding).catch((error) => {
            console.error("Failed finishing game:", error);
            if (isMountedRef.current) {
              setAnalyticsError(error.message || "Failed to save final game outcome.");
              setShowTransition(false);
            }
          });
        }, 1400);

        return;
      }

      if (isLastRound) {
        const finalEnding = getEndingFromScore(nextScore);

        setTimeout(() => {
          finishGame(finalEnding).catch((error) => {
            console.error("Failed finishing final round:", error);
            if (isMountedRef.current) {
              setAnalyticsError(error.message || "Failed to save final round.");
              setShowTransition(false);
            }
          });
        }, 1400);

        return;
      }

      setTimeout(() => {
        if (!isMountedRef.current) return;
        setCurrentRound((prev) => prev + 1);
        setSelectedOption(null);
        setShowTransition(false);
      }, 1400);
    } catch (error) {
      console.error("Failed to save analytics choice:", error);
      if (isMountedRef.current) {
        setAnalyticsError(error.message || "Failed to save player choice.");
        setShowTransition(false);
      }
    } finally {
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 1500);
    }
  };

  const handleRestart = () => {
    navigate("/");
  };

  if (gameOver && endingType === "nuclear") {
    return <NuclearWarScreen onRestart={handleRestart} />;
  }

  if (gameOver && endingType) {
    return (
      <EndingScreen
        endingType={endingType}
        score={score}
        onRestart={handleRestart}
      />
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-red-400 uppercase tracking-[0.3em]">
            Loading scenario...
          </p>
          {analyticsError ? (
            <p className="mt-4 font-mono text-xs text-red-700">{analyticsError}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="crt-overlay pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col gap-6 md:gap-8">
          <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <p className="font-mono text-[10px] md:text-xs text-red-700/70 tracking-[0.35em] uppercase mb-3">
                The Final Hour
              </p>
              <h1 className="font-display text-2xl md:text-4xl text-red-400 tracking-[0.2em] uppercase mb-3">
                {round.title}
              </h1>
              <p className="font-mono text-xs md:text-sm text-zinc-400 tracking-[0.18em] uppercase">
                {round.date}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:min-w-[320px]">
              <div className="border border-red-900/30 bg-zinc-950/70 rounded-sm p-4">
                <p className="font-mono text-[9px] text-zinc-600 tracking-[0.25em] uppercase mb-2">
                  Round
                </p>
                <p className="font-display text-2xl text-red-400">
                  {currentRound + 1}/{ROUNDS.length}
                </p>
              </div>

              <div className="border border-red-900/30 bg-zinc-950/70 rounded-sm p-4">
                <p className="font-mono text-[9px] text-zinc-600 tracking-[0.25em] uppercase mb-2">
                  Score
                </p>
                <p className="font-display text-2xl text-red-400">{score}</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
            <section className="border border-red-900/30 bg-zinc-950/70 rounded-sm p-5 md:p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="font-mono text-[9px] text-red-700/70 tracking-[0.35em] uppercase mb-2">
                    Situation Brief
                  </p>
                  <h2 className="font-display text-lg md:text-xl text-red-300/90 tracking-[0.16em] uppercase">
                    Executive Decision Required
                  </h2>
                </div>
                <CountdownClock round={currentRound} />
              </div>

              <motion.p
                key={currentRound}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="font-mono text-sm md:text-base leading-relaxed text-zinc-300 max-w-3xl mb-8"
              >
                {round.prompt}
              </motion.p>

              <AnimatePresence mode="wait">
                {!showTransition ? (
                  <motion.div
                    key={`round-${currentRound}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {round.options.map((option, index) => (
                      <DecisionCard
                        key={option.id || index}
                        option={option}
                        index={index}
                        onSelect={() => handleSelectOption(option)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`transition-${currentRound}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-red-900/30 bg-black/40 rounded-sm p-6 md:p-8"
                  >
                    <p className="font-mono text-[10px] text-red-700/70 tracking-[0.35em] uppercase mb-3">
                      Decision Recorded
                    </p>
                    <h3 className="font-display text-lg md:text-2xl text-red-300 tracking-[0.18em] uppercase mb-4">
                      {selectedOption?.label || selectedOption?.text || "Choice logged"}
                    </h3>
                    <p className="font-mono text-sm text-zinc-400 leading-relaxed">
                      {selectedOption?.response ||
                        selectedOption?.description ||
                        "Your order has been transmitted. Washington awaits the consequences."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <aside className="flex flex-col gap-6">
              <div className="border border-red-900/30 bg-zinc-950/70 rounded-sm p-5">
                <p className="font-mono text-[9px] text-red-700/70 tracking-[0.35em] uppercase mb-4">
                  Strategic Status
                </p>
                <DEFCONMeter level={defconLevel} />
              </div>

              <div className="border border-red-900/30 bg-zinc-950/70 rounded-sm p-5">
                <p className="font-mono text-[9px] text-red-700/70 tracking-[0.35em] uppercase mb-4">
                  Intelligence Feed
                </p>
                <HistoricalTicker round={currentRound} />
              </div>

              {analyticsError ? (
                <div className="border border-red-900/40 bg-red-950/20 rounded-sm p-4">
                  <p className="font-mono text-[10px] text-red-300 uppercase tracking-[0.2em] mb-2">
                    Analytics Warning
                  </p>
                  <p className="font-mono text-xs text-zinc-400">
                    {analyticsError}
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
