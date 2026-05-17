import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { base44 } from "@/api/base44Client";
import { ROUNDS } from "@/lib/gameData";
import { Lock, RefreshCw, Trash2 } from "lucide-react";

const COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#a855f7","#ec4899","#14b8a6"];

const ENDING_COLORS = {
  peace: "#22c55e",
  nuclear: "#ef4444",
  humiliation: "#eab308",
  aggressive_peace: "#f97316",
};

const ENDING_LABELS = {
  peace: "Peace Preserved",
  nuclear: "Nuclear War",
  humiliation: "Political Collapse",
  aggressive_peace: "Peace Through Strength",
};

function normalizeListResult(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function normalizeRoundId(value) {
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  const total = item.__total || 1;
  const pct = ((item.value / total) * 100).toFixed(1);

  return (
    <div className="bg-zinc-950 border border-red-900/40 rounded-sm px-3 py-2 text-xs font-mono">
      <p className="text-red-300/80 mb-0.5">{item.name}</p>
      <p className="text-white">
        {item.value} player{item.value !== 1 ? "s" : ""} — {pct}%
      </p>
    </div>
  );
}

function RoundPieChart({ roundIndex, records }) {
  const round = ROUNDS?.[roundIndex];

  const data = useMemo(() => {
    const counts = {};
    records.forEach((record) => {
      if (record?.ending_type) return;
      if (normalizeRoundId(record?.round_id) !== roundIndex) return;
      const key = record?.option_label || record?.option_id || record?.choice_label || "Unknown Choice";
      counts[key] = (counts[key] || 0) + 1;
    });
    const rows = Object.entries(counts).map(([name, value]) => ({ name, value }));
    const total = rows.reduce((sum, row) => sum + row.value, 0);
    return rows.map((row) => ({ ...row, __total: total }));
  }, [records, roundIndex]);

  const total = data.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="border border-red-900/30 bg-zinc-950/80 rounded-sm p-5">
      <div className="mb-1">
        <span className="font-mono text-[10px] text-red-700/70 tracking-widest uppercase">
          Round {roundIndex + 1}{round?.date ? ` — ${round.date}` : ""}
        </span>
      </div>
      <h3 className="font-display text-sm tracking-wider text-red-300/90 mb-1">
        {round?.title || `Round ${roundIndex + 1}`}
      </h3>
      <p className="font-mono text-[10px] text-zinc-500 mb-4">
        {total} response{total !== 1 ? "s" : ""}
      </p>

      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center">
          <p className="font-mono text-[10px] text-zinc-600 tracking-wider">NO DATA YET</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((entry, i) => (
                <Cell key={`${entry.name}-${i}`} fill={COLORS[i % COLORS.length]} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="font-mono text-[10px] text-zinc-400">{value}</span>}
              iconSize={8}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      if (!base44?.entities?.GameAnalytics) throw new Error("GameAnalytics entity not found");
      const result = await base44.entities.GameAnalytics.list("-created_date", 2000);
      setRecords(normalizeListResult(result));
    } catch (err) {
      console.error(err);
      setRecords([]);
      setError(`Failed to load analytics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function clearData() {
    if (!window.confirm("Delete ALL player analytics data? This cannot be undone.")) return;
    try {
      setClearing(true);
      setError("");
      const result = await base44.entities.GameAnalytics.list("-created_date", 5000);
      const rows = normalizeListResult(result);
      await Promise.all(rows.map((row) => base44.entities.GameAnalytics.delete(row.id)));
      setRecords([]);
    } catch (err) {
      console.error(err);
      setError(`Failed to clear: ${err.message}`);
    } finally {
      setClearing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const endingData = useMemo(() => {
    const counts = {};
    records.forEach((record) => {
      const key = record?.ending_type;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    const rows = Object.entries(counts).map(([key, value]) => ({
      name: ENDING_LABELS[key] || key,
      value,
      color: ENDING_COLORS[key] || "#6b7280",
    }));
    const total = rows.reduce((sum, row) => sum + row.value, 0);
    return rows.map((row) => ({ ...row, __total: total }));
  }, [records]);

  const totalGames = useMemo(() => {
    const sessions = new Set(
      records.map((r) => r?.session_id).filter((id) => typeof id === "string" && id.trim().length > 0)
    );
    if (sessions.size > 0) return sessions.size;
    return records.filter((r) => normalizeRoundId(r?.round_id) === 0).length;
  }, [records]);

  const totalDecisions = records.filter((r) => !r?.ending_type).length;
  const nuclearEndings = records.filter((r) => r?.ending_type === "nuclear").length;
  const peaceEndings = records.filter((r) => r?.ending_type === "peace").length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="crt-overlay pointer-events-none" />
      <div className="border-b border-red-900/30 bg-zinc-950/90">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-red-700" />
            <div>
              <p className="font-mono text-[9px] text-red-700/60 tracking-[0.4em] uppercase">Classified — Admin View</p>
              <h1 className="font-display text-lg md:text-2xl tracking-[0.25em] text-red-400 uppercase">Player Analytics</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-mono text-[9px] text-zinc-600 tracking-wider uppercase">Total Games</p>
              <p className="font-display text-2xl text-red-400 font-bold">{totalGames}</p>
            </div>
            <button onClick={fetchData} className="p-2 border border-red-900/30 rounded-sm text-red-700 hover:text-red-400 hover:border-red-700/50 transition-colors" title="Refresh data">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={clearData} disabled={clearing} className="p-2 border border-red-900/30 rounded-sm text-red-900 hover:text-red-500 hover:border-red-700/50 transition-colors disabled:opacity-40" title="Clear all player data">
              <Trash2 className={`w-4 h-4 ${clearing ? "animate-pulse" : ""}`} />
            </button>
            <button onClick={() => navigate("/")} className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 tracking-wider transition-colors border border-zinc-800 hover:border-zinc-600 px-3 py-2 rounded-sm">
              ← EXIT
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-red-800 border-t-red-400 rounded-full animate-spin mx-auto mb-4" />
              <p className="font-mono text-[10px] text-red-700/60 tracking-widest uppercase">Retrieving classified data...</p>
            </div>
          </div>
        ) : (
          <>
            {error ? (
              <div className="border border-red-900/40 bg-red-950/20 rounded-sm p-4 mb-6">
                <p className="font-mono text-[11px] text-red-300">{error}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Total Games Played", value: totalGames },
                { label: "Total Decisions Recorded", value: totalDecisions },
                { label: "Nuclear War Endings", value: nuclearEndings },
                { label: "Peace Endings", value: peaceEndings },
              ].map((stat) => (
                <div key={stat.label} className="border border-red-900/30 bg-zinc-950/60 rounded-sm p-4">
                  <p className="font-mono text-[9px] text-zinc-600 tracking-wider uppercase mb-1">{stat.label}</p>
                  <p className="font-display text-3xl font-bold text-red-400">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="border border-red-900/30 bg-zinc-950/80 rounded-sm p-5 mb-8">
              <h2 className="font-display text-sm tracking-[0.3em] text-red-400/90 uppercase mb-1">Game Endings Distribution</h2>
              <p className="font-mono text-[10px] text-zinc-500 mb-4">How do players&apos; crises end?</p>

              {endingData.length === 0 ? (
                <div className="h-40 flex items-center justify-center">
                  <p className="font-mono text-[10px] text-zinc-600 tracking-wider">NO DATA YET</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={endingData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none">
                      {endingData.map((entry, i) => (
                        <Cell key={`${entry.name}-${i}`} fill={entry.color} opacity={0.9} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => <span className="font-mono text-[10px] text-zinc-400">{value}</span>}
                      iconSize={8}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-red-900/30" />
              <span className="font-display text-[10px] tracking-[0.4em] text-red-700/70 uppercase">Choices Per Round</span>
              <div className="h-px flex-1 bg-red-900/30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ROUNDS.map((_, i) => (
                <RoundPieChart key={i} roundIndex={i} records={records} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
