import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ROUNDS } from "@/lib/gameData";

function makeSessionId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function endingFromScore(score) {
  if (score <= -3) return "nuclear";
  if (score <= 1) return "humiliation";
  if (score <= 5) return "aggressive_peace";
  return "peace";
}

export default function Game() {
  const navigate = useNavigate();
  const [sessionId] = useState(makeSessionId());
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);

  const round = ROUNDS?.[roundIndex];

  async function saveChoice(option, currentIndex, nextScore) {
    await base44.entities.GameAnalytics.create({
      session_id: sessionId,
      round_id: currentIndex,
      option_id: option?.id ?? null,
      option_label: option?.label ?? option?.text ?? "Unknown Choice",
      ending_type: null,
    });

    const forcedEnding = option?.ending_type || null;
    const scoreEnding = nextScore <= -3 ? "nuclear" : null;
    const isLastRound = currentIndex === ROUNDS.length - 1;
    const finalEnding = forcedEnding || scoreEnding || (isLastRound ? endingFromScore(nextScore) : null);

    if (finalEnding) {
      await base44.entities.GameAnalytics.create({
        session_id: sessionId,
        round_id: null,
        option_id: null,
        option_label: null,
        ending_type: finalEnding,
      });
      navigate("/ending", { state: { endingType: finalEnding, score: nextScore } });
      return;
    }

    setRoundIndex(currentIndex + 1);
  }

  async function handleChoice(option) {
    if (!round || busy) return;
    setBusy(true);

    try {
      const nextScore = score + Number(option?.score ?? 0);
      setScore(nextScore);
      await saveChoice(option, roundIndex, nextScore);
    } catch (error) {
      console.error("Analytics/game save failed:", error);
      alert("There was a problem saving the game state.");
    } finally {
      setBusy(false);
    }
  }

  if (!round) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-mono text-sm tracking-widest uppercase text-red-400">
          Loading scenario...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs tracking-[0.35em] uppercase text-red-700/70 mb-3">
          The Final Hour
        </p>

        <h1 className="font-display text-3xl md:text-5xl text-red-400 uppercase mb-2">
          {round.title}
        </h1>

        <p className="font-mono text-sm text-zinc-500 uppercase mb-8">
          {round.date}
        </p>

        <div className="border border-red-900/30 bg-zinc-950/70 rounded-sm p-6 mb-8">
          <p className="font-mono text-base leading-relaxed text-zinc-300">
            {round.prompt}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {round.options.map((option, i) => (
            <button
              key={option.id || i}
              onClick={() => handleChoice(option)}
              disabled={busy}
              className="text-left border border-red-900/30 bg-zinc-950/70 hover:border-red-700/50 rounded-sm p-5 transition-colors disabled:opacity-50"
            >
              <p className="font-display text-lg text-red-300 uppercase mb-2">
                {option.label || option.text || `Option ${i + 1}`}
              </p>
              <p className="font-mono text-sm text-zinc-400">
                {option.description || option.response || "Proceed with this decision."}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
