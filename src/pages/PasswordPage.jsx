import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";

const CORRECT_PASSWORD = "RTTSD1";

export default function PasswordPage() {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      navigate("/analytics");
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(false), 2000);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="crt-overlay" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <Lock className="w-10 h-10 text-red-600" />
          </motion.div>
        </div>

        <div className="text-center mb-8">
          <p className="font-display text-[10px] tracking-[0.4em] text-red-700/80 uppercase mb-1">
            Classified Access
          </p>
          <h1 className="font-display text-xl tracking-[0.3em] text-red-500/90 uppercase">
            Enter Clearance Code
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative mb-4"
          >
            <input
              type={show ? "text" : "password"}
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="_ _ _ _ _ _"
              maxLength={10}
              autoFocus
              className={`w-full bg-transparent border ${
                error ? "border-red-500" : "border-red-900/60"
              } rounded-sm px-4 py-3 font-mono text-center text-lg tracking-[0.5em] text-red-300 placeholder:text-red-900/40 focus:outline-none focus:border-red-600 transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-900/50 hover:text-red-600 transition-colors"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[10px] text-red-500 text-center tracking-wider mb-4"
            >
              ACCESS DENIED — INVALID CODE
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-red-900/40 hover:bg-red-800/60 border border-red-800/60 text-red-300 font-display tracking-[0.3em] text-sm py-3 rounded-sm transition-colors uppercase"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="font-mono text-[10px] text-red-900/40 hover:text-red-800/60 tracking-wider transition-colors"
          >
            ← Return
          </button>
        </div>
      </motion.div>
    </div>
  );
}
