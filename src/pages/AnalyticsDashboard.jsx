import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
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

function normalizeListResult(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function normalizeRoundId(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function buildChartData(records, roundIndex) {
  const counts = {};

  records.forEach((record) => {
    const recordRound = normalizeRoundId(record?.round_id);
    if (recordRound !== roundIndex) return;
    if (record?.ending_type) return;

    const key =
      record?.option_label ||
      record?.option_id ||
      record?.choice_label ||
      "Unknown Choice";

    counts[key] = (counts[key] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return data.map((item) => ({
    ...item,
    __total: total,
  }));
}

function buildEndingData(records) {
  const counts = {};

  records.forEach((record) => {
    const key = record?.ending_type;
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });

  const data = Object.entries(counts).map(([key, value]) => ({
    name: ENDING_LABELS[key] || key,
    va
