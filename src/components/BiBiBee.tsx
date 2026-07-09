import React from "react";

interface BiBiBeeProps {
  expression?: "happy" | "thinking" | "speaking" | "normal";
  className?: string;
  size?: number;
}

export const BiBiBee: React.FC<BiBiBeeProps> = ({
  expression = "normal",
  className = "",
  size = 120,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block select-none animate-float ${className}`}
      id="bibi-bee-character"
    >
      {/* Bee body and accessories container */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow underneath */}
        <ellipse
          cx="50"
          cy="92"
          rx="20"
          ry="4"
          fill="#000000"
          opacity="0.1"
          className="transition-all duration-1000"
        />

        {/* Antennae */}
        <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
          {/* Left antenna */}
          <path d="M42,28 C38,18 30,20 28,24" />
          {/* Right antenna */}
          <path d="M58,28 C62,18 70,20 72,24" />
        </g>
        {/* Antenna bulbs */}
        <circle cx="28" cy="24" r="3.5" fill="#eab308" stroke="#1e293b" strokeWidth="2" />
        <circle cx="72" cy="24" r="3.5" fill="#eab308" stroke="#1e293b" strokeWidth="2" />

        {/* Wings (with flapping animation) */}
        <g className="animate-wings" style={{ transformOrigin: "50px 38px" }}>
          {/* Left wing */}
          <ellipse
            cx="32"
            cy="28"
            rx="12"
            ry="18"
            fill="#f1f5f9"
            fillOpacity="0.8"
            stroke="#94a3b8"
            strokeWidth="2"
            transform="rotate(-25, 32, 28)"
          />
          <path d="M28,20 Q32,28 35,16" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right wing */}
          <ellipse
            cx="68"
            cy="28"
            rx="12"
            ry="18"
            fill="#f1f5f9"
            fillOpacity="0.8"
            stroke="#94a3b8"
            strokeWidth="2"
            transform="rotate(25, 68, 28)"
          />
          <path d="M72,20 Q68,28 65,16" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Stinger */}
        <path d="M50,84 L46,92 L54,92 Z" fill="#1e293b" />

        {/* Bee Legs */}
        <g stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M35,74 L28,82" />
          <path d="M65,74 L72,82" />
          <path d="M40,76 L38,84" />
          <path d="M60,76 L62,84" />
        </g>

        {/* Bee Body (striped) */}
        <g>
          {/* Main body yellow base */}
          <ellipse cx="50" cy="56" rx="26" ry="24" fill="#fbbf24" stroke="#1e293b" strokeWidth="3" />

          {/* Dark stripes */}
          <path
            d="M27,47 Q50,49 73,47"
            stroke="#1e293b"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M24,57 Q50,59 76,57"
            stroke="#1e293b"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M28,67 Q50,69 72,67"
            stroke="#1e293b"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Cute Face */}
        <g id="bibi-eyes-and-mouth">
          {/* Rosy cheeks */}
          <circle cx="34" cy="56" r="4.5" fill="#f43f5e" opacity="0.4" />
          <circle cx="66" cy="56" r="4.5" fill="#f43f5e" opacity="0.4" />

          {/* Eyes based on expression */}
          {expression === "thinking" ? (
            <g stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none">
              {/* Curved blinking eyes */}
              <path d="M36,52 Q40,49 44,52" />
              <path d="M56,52 Q60,49 64,52" />
            </g>
          ) : expression === "happy" ? (
            <g stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none">
              {/* Smiling upward eyes */}
              <path d="M34,54 Q40,47 42,54" />
              <path d="M58,54 Q60,47 66,54" />
            </g>
          ) : (
            <>
              {/* Normal round sparkly eyes */}
              <circle cx="40" cy="51" r="4.5" fill="#1e293b" />
              <circle cx="60" cy="51" r="4.5" fill="#1e293b" />
              {/* Highlights */}
              <circle cx="38.5" cy="49.5" r="1.5" fill="#ffffff" />
              <circle cx="58.5" cy="49.5" r="1.5" fill="#ffffff" />
            </>
          )}

          {/* Mouth */}
          {expression === "speaking" ? (
            // Round open speaking mouth
            <ellipse cx="50" cy="62" rx="4.5" ry="6" fill="#1e293b" />
          ) : expression === "thinking" ? (
            // Slight cute wavy line
            <path
              d="M47,62 Q50,64 53,62"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Big happy smile!
            <path
              d="M44,59 Q50,67 56,59"
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* Honey dropper/glowing star embellishment */}
        {expression === "happy" && (
          <g>
            <path
              d="M20,12 L22,18 L28,20 L22,22 L20,28 L18,22 L12,20 L18,18 Z"
              fill="#fbbf24"
              className="animate-pulse"
            />
            <path
              d="M80,12 L82,18 L88,20 L82,22 L80,28 L78,22 L72,20 L78,18 Z"
              fill="#fbbf24"
              className="animate-pulse"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
