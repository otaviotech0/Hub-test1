import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import "../style/Foco.css";

const TOTAL_SECONDS = 25 * 60;
const CIRCUMFERENCE = 2 * Math.PI * 120;

export default function Foco() {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handlePlayPause = () => {
    if (!running && remaining === 0) setRemaining(TOTAL_SECONDS);
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(TOTAL_SECONDS);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = remaining / TOTAL_SECONDS;
  const offset = (CIRCUMFERENCE * (1 - pct)).toFixed(2);

  return (
    <div className="focus-page-center">
      <header className="focus-header">
        <h1>Sessão de Foco</h1>
        <p>Afaste as distrações e mergulhe nos seus estudos.</p>
      </header>

      <div className="big-timer-container">
        <div className="big-timer-ring-wrapper">
          <svg viewBox="0 0 260 260" aria-hidden="true">
            <circle className="big-timer-ring-bg" cx="130" cy="130" r="120" />
            <circle
              className="big-timer-ring-fg"
              cx="130"
              cy="130"
              r="120"
              style={{
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: offset,
              }}
            />
          </svg>
          <div className="big-timer-text">
            {mm}:{ss}
          </div>
        </div>

        <div className="big-foco-controls">
          <button
            type="button"
            className="big-btn-play"
            onClick={handlePlayPause}
            aria-label={running ? "Pausar" : "Iniciar"}
          >
            {running ? (
              <Pause size={24} />
            ) : (
              <Play size={24} style={{ marginLeft: "4px" }} />
            )}
          </button>

          <button type="button" className="big-btn-reset" onClick={handleReset}>
            <RotateCcw size={16} style={{ marginRight: "6px" }} />
            Resetar Ciclo
          </button>
        </div>
      </div>
    </div>
  );
}
