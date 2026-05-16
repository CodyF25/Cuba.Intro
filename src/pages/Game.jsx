import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ROUNDS, INITIAL_STATE } from "@/lib/gameData";
import { base44 } from "@/api/base44Client";
import IntroScreen from "@/components/game/IntroScreen";
import TensionMeter from "@/components/game/TensionMeter";
import NewsTicker from "@/components/game/NewsTicker";
import AdvisorPanel from "@/components/game/AdvisorPanel";
import DecisionCard from "@/components/game/DecisionCard";
import ConsequenceScreen from "@/components/game/ConsequenceScreen";
import StatusBar from "@/components/game/StatusBar";
import RoundBriefing from "@/components/game/RoundBriefing";
import CountdownTimer from "@/components/game/CountdownTimer";
import RadarWidget from "@/components/game/RadarWidget";
import NuclearWarScreen from "@/components/game/NuclearWarScreen";
import EndingScreen from "@/components/game/EndingScreen";
import LegacyScreen from "@/components/game/LegacyScreen";
import { Radiation } from "lucide-react";

const PHASE_INTRO = "intro";
const PHASE_PLAYING = "playing";
const PHASE_CONSEQUENCE = "consequence";
const PHASE_NUCLEAR = "nuclear";
const PHASE_ENDING = "ending";
const PHASE_LEGACY = "legacy";

function generateSessionId() {
  return Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}

function determineEnding(state) {
  if (state.tension >= 95) return "nuclear";
  if (state.tension <= 15 && state.worldOpinion >= 50) return "peace";
  if (state.militaryPressure >= 80 && state.worldOpinion < 30) return "humiliation";
  if (state.tension >= 50 && state.worldOpinion >= 40) return "aggressive_peace";
  if (state.worldOpinion >= 50) return "peace";
  return "aggressive_peace";
}

export default function Game() {
  const [phase, setPhase] = useState(PHASE_INTRO);
  const [gameState, setGameState] = useState({ ...INITIAL_STATE });
  const [lastChoice, setLastChoice] = useState(null);
  const [endingType, setEndingType] = useState(null);
  const [timerKey, setTimerKey] = useState(0);
  const sessionId = useRef(generateSessionId());

  const handleStart = () => {
    sessionId.current = generateSessionId();
    setGameState({ ...INITIAL_STATE });
    setPhase(PHASE_PLAYING);
    setTimerKey(prev => prev + 1);
  };

  const trackChoice = useCallback((option, roundIndex, endingTypeValue = null) => {
    const round = ROUNDS[roundIndex];
    base44.entities.GameAnalytics.create({
      round_id: roundIndex,
      round_title: round?.title || "",
      option_id: option.id,
      option_label: option.label,
      ending_type: endingTypeValue,
      session_id: sessionId.current,
    });
  }, []);

  const handleDecision = useCallback((option) => {
    setLastChoice(option);

    const newState = {
      ...gameState,
      tension: Math.max(0, Math.min(100, gameState.tension + option.tensionChange)),
      worldOpinion: Math.max(0, Math.min(100, gameState.worldOpinion + option.worldOpinionChange)),
      militaryPressure: Math.max(0, Math.min(100, gameState.militaryPressure + option.militaryPressureChange)),
      sovietTrust: Math.max(0, Math.min(100, gameState.sovietTrust + option.sovietTrustChange)),
      choices: [...gameState.choices, option],
    };

    setGameState(newState);

    // Check for nuclear war
    if (newState.tension >= 95) {
      trackChoice(option, gameState.round, "nuclear");
      setPhase(PHASE_NUCLEAR);
      return;
    }

    // If this is the last round, determine ending and track it
    const isLastRound = gameState.round + 1 >= ROUNDS.length;
    if (isLastRound) {
      const ending = determineEnding(newState);
      trackChoice(option, gameState.round, ending);
    } else {
      trackChoice(option, gameState.round, null);
    }

    setPhase(PHASE_CONSEQUENCE);
  }, [gameState, trackChoice]);

  const handleContinueFromConsequence = useCallback(() => {
    const nextRound = gameState.round + 1;

    if (nextRound >= ROUNDS.length) {
      const ending = determineEnding(gameState);
      setEndingType(ending);
      setPhase(PHASE_ENDING);
      return;
    }

    setGameState(prev => ({
      ...prev,
      round: nextRound,
      date: ROUNDS[nextRound].date,
    }));
    setPhase(PHASE_PLAYING);
    setTimerKey(prev => prev + 1);
  }, [gameState]);

  const handleTimerExpire = useCallback(() => {
    const currentRound = ROUNDS[gameState.round];
    if (currentRound && phase === PHASE_PLAYING) {
      handleDecision(currentRound.options[0]);
    }
  }, [gameState.round, phase, handleDecision]);

  const handleRestart = () => {
    setGameState({ ...INITIAL_STATE });
    setLastChoice(null);
    setEndingType(null);
    setPhase(PHASE_INTRO);
  };

  // INTRO
  if (phase === PHASE_INTRO) {
    return <IntroScreen onStart={handleStart} />;
  }

  // NUCLEAR WAR
  if (phase === PHASE_NUCLEAR) {
    return (
      <NuclearWarScreen
        onRestart={handleRestart}
      />
    );
  }

  // ENDING
  if (phase === PHASE_ENDING) {
    return (
      <EndingScreen
        endingType={endingType}
        choices={gameState.choices}
        onRestart={handleRestart}
        onViewLegacy={() => setPhase(PHASE_LEGACY)}
      />
    );
  }

  // LEGACY
  if (phase === PHASE_LEGACY) {
    return <LegacyScreen onRestart={handleRestart} />;
  }

  // CONSEQUENCE
  if (phase === PHASE_CONSEQUENCE && lastChoice) {
    return (
      <ConsequenceScreen
        option={lastChoice}
        onContinue={handleContinueFromConsequence}
      />
    );
  }

  // PLAYING
  const currentRound = ROUNDS[gameState.round];
  if (!currentRound) return null;

  return (
    <div className="min-h-screen bg-background relative">
      {/* CRT overlay */}
      <div className="crt-overlay" />

      {/* News ticker */}
      <NewsTicker headline={currentRound.newsHeadline} />

      {/* Main game layout */}
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radiation className="w-4 h-4 text-primary" />
            <span className="font-display text-sm tracking-[0.2em] text-foreground uppercase">
              White House Situation Room
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-muted-foreground">
              ROUND {gameState.round + 1} / {ROUNDS.length}
            </span>
            <CountdownTimer
              key={timerKey}
              seconds={120}
              onExpire={handleTimerExpire}
              paused={phase !== PHASE_PLAYING}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar - Status */}
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
            <TensionMeter tension={gameState.tension} />
            <StatusBar
              worldOpinion={gameState.worldOpinion}
              militaryPressure={gameState.militaryPressure}
              sovietTrust={gameState.sovietTrust}
              date={gameState.date}
            />
            <div className="hidden lg:block">
              <RadarWidget />
            </div>
          </div>

          {/* Center - Briefing and Decisions */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <RoundBriefing round={currentRound} />

            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border" />
                <span className="font-display text-[10px] tracking-[0.3em] text-primary uppercase">
                  Choose Your Response
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3">
                {currentRound.options.map((option, i) => (
                  <DecisionCard
                    key={option.id}
                    option={option}
                    index={i}
                    onSelect={handleDecision}
                    disabled={phase !== PHASE_PLAYING}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar - Advisors */}
          <div className="lg:col-span-3 order-3">
            <AdvisorPanel advisors={currentRound.advisors} />
          </div>
        </div>
      </div>
    </div>
  );
}
