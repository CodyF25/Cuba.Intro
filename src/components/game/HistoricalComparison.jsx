import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HISTORICAL_COMPARISON, ROUNDS } from "@/lib/gameData";
import { ArrowRight, ArrowLeft, CheckCircle, Quote, Clock, BookOpen, Globe } from "lucide-react";

export default function HistoricalComparison({ choices, onViewLegacy, onRestart }) {
  const [tab, setTab] = useState("comparison");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-display text-xs tracking-[0.3em] text-secondary uppercase mb-2">
            Declassified Report
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground tracking-wider">
            REALITY vs YOUR TIMELINE
          </h1>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {[
            { id: "comparison", label: "Your Choices vs Kennedy's" },
            { id: "facts", label: "Key Facts" },
            { id: "quotes", label: "Real Quotes" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-display text-xs tracking-wider px-4 py-2 rounded-sm border transition-colors ${
                tab === t.id
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Comparison tab */}
        {tab === "comparison" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Side by side comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border bg-card rounded-sm p-4">
                <h3 className="font-display text-sm tracking-wider text-primary mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-mono">
                    YOU
                  </span>
                  Your Decisions
                </h3>
                <div className="space-y-3">
                  {choices.map((choice, i) => (
                    <div key={i} className="border-l-2 border-primary/30 pl-3">
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {ROUNDS[i]?.date} — {ROUNDS[i]?.title}
                      </div>
                      <div className="font-mono text-xs text-foreground/80 mt-0.5">
                        {choice.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-secondary/30 bg-secondary/5 rounded-sm p-4">
                <h3 className="font-display text-sm tracking-wider text-secondary mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-[10px] font-mono">
                    JFK
                  </span>
                  What Kennedy Actually Did
                </h3>
                <div className="space-y-3">
                  {HISTORICAL_COMPARISON.kennedyChoices.map((choice, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
                      <span className="font-mono text-xs text-foreground/70">{choice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Facts tab */}
        {tab === "facts" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
            {HISTORICAL_COMPARISON.keyFacts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border border-border bg-card rounded-sm p-4"
              >
                <div className="font-display text-2xl font-bold text-secondary mb-1">{fact.fact}</div>
                <p className="font-mono text-xs text-muted-foreground">{fact.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quotes tab */}
        {tab === "quotes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {HISTORICAL_COMPARISON.quotes.map((quote, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="border border-border bg-card rounded-sm p-5"
              >
                <Quote className="w-5 h-5 text-secondary/40 mb-2" />
                <p className="font-typewriter text-sm text-foreground/80 leading-relaxed italic mb-3">
                  "{quote.text}"
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  — {quote.author}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Button onClick={onRestart} variant="outline" className="border-border text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Play Again
          </Button>
          <Button onClick={onViewLegacy} className="bg-secondary text-secondary-foreground font-display tracking-wider">
            The Long-Term Legacy <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
