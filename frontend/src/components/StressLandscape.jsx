/**
 * @fileoverview StressLandscape — renders an SVG scene that visually encodes
 * the student's current anxiety level as a serene, stormy, or navigating landscape.
 */

/**
 * Determines the landscape variant and renders the corresponding inline SVG scene.
 *
 * @param {{ anxietyScore: number }} props
 * @returns {JSX.Element}
 */
export default function StressLandscape({ anxietyScore }) {
  const isLow = anxietyScore < 40;
  const isMedium = anxietyScore >= 40 && anxietyScore < 75;
  const isHigh = anxietyScore >= 75;

  const VARIANTS = {
    low: {
      title: 'Serene Mindspace',
      description:
        "Your cognitive load is within a healthy baseline. Keep doing what you're doing.",
      bgGradient:
        'from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/10',
      borderColor: 'border-emerald-200 dark:border-emerald-800/60',
      titleColor: 'text-emerald-600 dark:text-emerald-400',
    },
    medium: {
      title: 'Navigating Winds',
      description:
        'Moderate mental load detected. Take short breathing breaks to regain stability.',
      bgGradient:
        'from-amber-500/10 to-orange-500/5 dark:from-amber-950/20 dark:to-orange-950/10',
      borderColor: 'border-amber-200 dark:border-amber-800/60',
      titleColor: 'text-amber-600 dark:text-amber-400',
    },
    high: {
      title: 'Stormy Horizon',
      description:
        'High emotional overload. Halt rigorous studying, step away, and seek support.',
      bgGradient:
        'from-rose-500/10 to-purple-500/5 dark:from-rose-950/20 dark:to-purple-950/10',
      borderColor: 'border-rose-200 dark:border-rose-800/60',
      titleColor: 'text-rose-500 dark:text-rose-400',
    },
  };

  const variant = isHigh ? VARIANTS.high : isMedium ? VARIANTS.medium : VARIANTS.low;

  return (
    <div
      className={`bg-white dark:bg-[#121212] bg-gradient-to-br ${variant.bgGradient} border ${variant.borderColor} rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center gap-6 transition-all duration-500`}
      aria-label={`Mental landscape: ${variant.title}`}
    >
      <div className="flex-1 space-y-2">
        <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">
          Mental Landscape Visualization
        </span>
        <h3 className={`text-base font-bold ${variant.titleColor} flex items-center gap-2`}>
          {variant.title}
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          {variant.description}
        </p>
      </div>

      <div
        className={`w-full md:w-64 h-36 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-850 relative bg-gradient-to-br ${
          isLow
            ? 'from-sky-100 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/40'
            : isMedium
            ? 'from-amber-50 to-orange-100/50 dark:from-slate-900 dark:to-amber-950/40'
            : 'from-purple-950/30 to-rose-950/40 dark:from-slate-950 dark:to-rose-950/30'
        } transition-all duration-500 flex items-center justify-center`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 300 120"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={variant.title}
        >
          <defs>
            <linearGradient id="hill-low" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hill-medium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hill-high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#be123c" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="sky-high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#31102f" />
            </linearGradient>
          </defs>

          {isLow && (
            <g>
              <circle cx="250" cy="35" r="18" fill="#fef08a" filter="drop-shadow(0px 0px 8px #fef08a)" />
              <path d="M 0 120 Q 90 60 180 85 T 300 95 L 300 120 L 0 120 Z" fill="#6ee7b7" opacity="0.6" />
              <path d="M 0 120 Q 120 75 220 90 T 300 105 L 300 120 L 0 120 Z" fill="url(#hill-low)" />
              <path d="M 40 40 Q 45 32 53 35 Q 60 30 67 36 Q 73 37 72 43 Z" fill="#ffffff" opacity="0.9" />
              <path d="M 140 25 Q 148 15 158 18 Q 166 12 175 19 Q 182 21 180 28 Z" fill="#ffffff" opacity="0.75" />
              <path d="M 90 25 Q 93 21 95 25 Q 97 21 100 25" fill="none" stroke="#059669" strokeWidth="1" strokeLinecap="round" />
              <path d="M 110 32 Q 112 29 114 32 Q 116 29 118 32" fill="none" stroke="#059669" strokeWidth="1" strokeLinecap="round" />
              <line x1="75" y1="90" x2="75" y2="78" stroke="#047857" strokeWidth="2.5" />
              <circle cx="75" cy="74" r="7" fill="#059669" />
              <circle cx="71" cy="76" r="5" fill="#34d399" />
            </g>
          )}

          {isMedium && (
            <g>
              <circle cx="240" cy="45" r="15" fill="#fed7aa" opacity="0.8" />
              <path d="M 0 120 Q 80 75 160 90 T 300 98 L 300 120 L 0 120 Z" fill="#fde047" opacity="0.5" />
              <path d="M 0 120 Q 110 80 200 95 T 300 110 L 300 120 L 0 120 Z" fill="url(#hill-medium)" />
              <path d="M 20 30 Q 80 15 130 25 T 200 15" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.8" />
              <path d="M 50 50 Q 110 40 170 45 T 250 35" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />
              <path d="M 140 60 Q 142 55 145 60" fill="#d97706" opacity="0.8" />
              <path d="M 180 70 Q 183 67 185 71" fill="#ea580c" opacity="0.8" />
              <path d="M 90 98 Q 87 90 85 82" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="82" cy="77" rx="8" ry="6" fill="#ea580c" transform="rotate(-15 82 77)" />
              <ellipse cx="86" cy="73" rx="6" ry="5" fill="#fbbf24" transform="rotate(-15 86 73)" />
            </g>
          )}

          {isHigh && (
            <g>
              <rect width="300" height="120" fill="url(#sky-high)" opacity="0.3" />
              <path d="M 0 120 L 40 85 L 90 100 L 150 70 L 220 95 L 300 75 L 300 120 Z" fill="#881337" opacity="0.4" />
              <path d="M 0 120 L 50 95 L 110 105 L 180 80 L 240 102 L 300 90 L 300 120 Z" fill="url(#hill-high)" />
              <path d="M 120 30 Q 130 18 145 22 Q 155 12 170 18 Q 185 14 195 24 Q 205 28 200 38 Q 195 44 180 42 Q 165 44 150 42 Q 135 44 125 38 Z" fill="#475569" opacity="0.9" />
              <path d="M 130 34 Q 138 24 150 27 Q 158 18 170 23 Q 180 20 188 28 Z" fill="#334155" opacity="0.95" />
              <path d="M 160 38 L 150 55 L 162 55 L 152 75" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0px 0px 4px #fbbf24)" />
              <path d="M 182 36 L 175 48 L 184 48 L 178 64" fill="none" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0px 0px 3px #fbbf24)" />
              <line x1="130" y1="45" x2="120" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
              <line x1="145" y1="45" x2="135" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
              <line x1="165" y1="45" x2="155" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.2" />
              <line x1="190" y1="45" x2="180" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
              <line x1="205" y1="45" x2="195" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
