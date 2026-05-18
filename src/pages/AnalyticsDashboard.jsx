import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { base44 } from "@/api/base44Client";
import { ROUNDS } from "@/lib/gameData";
import { Lock, RefreshCw, Trash2 } from "lucide-react";

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#a855f7", "#ec4899", "#14b8a6",
];

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

function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Network timeout loading analytics.")), ms)
    ),
  ]);
}

function normalizeRecords(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.records)) return data.records;
  return [];
}

function buildChartData(records, roundIndex) {
  const counts = {};
  records
    .filter((r) => Number(r.round_id) === roundIndex)
    .forEach((r) => {
      const key = r.option_label || r.option_id || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function buildEndingData(records) {
  const counts = {};
  records
    .filter((r) => r.ending_type)
    .forEach((r) => {
      const key = r.ending_type;
      counts[key] = (counts[key] || 0) + 1;
    });

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return Object.entries(counts).map(([key, value]) => ({
    name: ENDING_LABELS[key] || key,
    value,
    color: ENDING_COLORS[key] || "#6b7280",
    __total: total,
  }));
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const total = payload[0].payload.__total || 1;
    const pct = ((value / total) * 100).toFixed(1);

    return (
      <div className="bg-zinc-950 border border-red-900/40 rounded-sm px-3 py-2 text-xs font-mono">
        <p className="text-red-300/80 mb-0.5">{name}</p>
        <p className="text-white">
          {value} player{value !== 1 ? "s" : ""} &mdash; {pct}%
        </p>
      </div>
    );
  }
  return null;
};

function RoundPieChart({ roundIndex, records }) {
  const round = ROUNDS?.[roundIndex];
  const rawData = buildChartData(records, roundIndex);
  const total = rawData.reduce((sum, d) => sum + d.value, 0);
  const data = rawData.map((d) => ({ ...d, __total: total }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: roundIndex * 0.08 }}
      className="border border-red-900/30 bg-zinc-950/80 rounded-sm p-5"
    >
      <div className="mb-1">
        <span className="font-mono text-[10px] text-red-700/70 tracking-widest uppercase">
          Round {roundIndex + 1} — {round?.date || "Unknown Date"}
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
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={`${entry.name}-${i}`} fill={COLORS[i % COLORS.length]} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="font-mono text-[10px] text-zinc-400">{value}</span>
              )}
              iconSize={8}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError("");
      }

      const data = await withTimeout(
        base44.entities.GameAnalytics.list("-created_date", 2000),
        8000
      );

      const normalized = normalizeRecords(data);

      if (isMountedRef.current) {
        setRecords(normalized);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);

      if (isMountedRef.current) {
        setRecords([]);
        setError(err?.message || "Failed to load analytics data.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const clearData = async () => {
    alert("Clear is temporarily disabled while Base44 network requests are unstable.");
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  const endingData = buildEndingData(records);

  const totalGames = (() => {
    const sessions = new Set(
      records.filter((r) => r.session_id).map((r) => r.session_id)
    );
    return sessions.size || records.filter((r) => Number(r.round_id) === 0).length;
  })();

  const totalDecisions = records.filter((r) => !r.ending_type).length;
  const nuclearEndings = records.filter((r) => r.ending_type === "nuclear").length;
  const peaceEndings = records.filter((r) => r.ending_type === "peace").length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="crt-overlay pointer-events-none" />

      <div className="border-b border-red-900/30 bg-zinc-950/90">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-red-700" />
            <div>
              <p className="font-mono text-[9px] text-red-700/60 tracking-[0.4em] uppercase">
                Classified — Admin View
              </p>
              <h1 className="font-display text-lg md:text-2xl tracking-[0.25em] text-red-400 uppercase">
                Player Analytics
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-mono text-[9px] text-zinc-600 tracking-wider uppercase">
                Total Games
              </p>
              <p className="font-display text-2xl text-red-400 font-bold">{totalGames}</p>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 border border-red-900/30 rounded-sm text-red-700 hover:text-red-400 hover:border-red-700/50 transition-colors disabled:opacity-40"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={clearData}
              disabled
              className="p-2 border border-red-900/30 rounded-sm text-red-900 disabled:opacity-40"
              title="Clear temporarily disabled"
            >
              <Trash2 className={`w-4 h-4 ${clearing ? "animate-pulse" : ""}`} />
            </button>

            <button
              onClick={() => navigate("/")}
              className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 tracking-wider transition-colors border border-zinc-800 hover:border-zinc-600 px-3 py-2 rounded-sm"
            >
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
              <p className="font-mono text-[10px] text-red-700/60 tracking-widest uppercase">
                Retrieving classified data...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="border border-red-900/30 bg-zinc-950/80 rounded-sm p-6 text-center">
            <p className="font-mono text-[11px] text-red-400 tracking-wider uppercase mb-3">
              {error}
            </p>
            <button
              onClick={fetchData}
              className="font-mono text-[10px] text-zinc-300 hover:text-white tracking-wider border border-zinc-700 hover:border-zinc-500 px-3 py-2 rounded-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Total Games Played", value: totalGames },
                { label: "Total Decisions Recorded", value: totalDecisions },
                { label: "Nuclear War Endings", value: nuclearEndings },
                { label: "Peace Endings", value: peaceEndings },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-red-900/30 bg-zinc-950/60 rounded-sm p-4"
                >
                  <p className="font-mono text-[9px] text-zinc-600 tracking-wider uppercase mb-1">
                    {stat.label}
                  </p>
                  <p className="font-display text-3xl font-bold text-red-400">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-red-900/30 bg-zinc-950/80 rounded-sm p-5 mb-8"
            >
              <h2 className="font-display text-sm tracking-[0.3em] text-red-400/90 uppercase mb-1">
                Game Endings Distribution
              </h2>
              <p className="font-mono text-[10px] text-zinc-500 mb-4">
                How do players' crises end?
              </p>

              {endingData.length === 0 ? (
                <div className="h-40 flex items-center justify-center">
                  <p className="font-mono text-[10px] text-zinc-600 tracking-wider">NO DATA YET</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={endingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {endingData.map((entry, i) => (
                        <Cell key={`${entry.name}-${i}`} fill={entry.color} opacity={0.9} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="font-mono text-[10px] text-zinc-400">{value}</span>
                      )}
                      iconSize={8}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-red-900/30" />
              <span className="font-display text-[10px] tracking-[0.4em] text-red-700/70 uppercase">
                Choices Per Round
              </span>
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
