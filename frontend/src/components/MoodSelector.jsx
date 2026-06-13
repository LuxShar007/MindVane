/**
 * @fileoverview MoodSelector component — renders a row of interactive emoji
 * pill buttons for daily mood logging in the Stress Analyzer workflow.
 */

/** @type {Array<{id: string, emoji: string, label: string, activeClass: string}>} */
export const MOOD_LIST = [
  {
    id: 'Happy',
    emoji: '😊',
    label: 'Happy',
    activeClass:
      'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/20',
  },
  {
    id: 'Sad',
    emoji: '😔',
    label: 'Sad',
    activeClass:
      'bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-blue-500/20',
  },
  {
    id: 'Anxious',
    emoji: '😰',
    label: 'Anxious',
    activeClass:
      'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 shadow-amber-500/20',
  },
  {
    id: 'Tired',
    emoji: '🥱',
    label: 'Tired',
    activeClass:
      'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400 shadow-purple-500/20',
  },
  {
    id: 'Angry',
    emoji: '😡',
    label: 'Angry',
    activeClass:
      'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 shadow-rose-500/20',
  },
];

/**
 * MoodSelector — daily mood log pill-button row.
 *
 * @param {{ mood: string, onMoodChange: (id: string) => void }} props
 * @returns {JSX.Element}
 */
export default function MoodSelector({ mood, onMoodChange }) {
  return (
    <div className="space-y-2">
      <span
        id="mood-selector-label"
        className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
      >
        Today&apos;s Mood Log
      </span>
      <div
        className="flex gap-2 flex-wrap"
        role="group"
        aria-labelledby="mood-selector-label"
      >
        {MOOD_LIST.map((m) => {
          const isActive = mood === m.id;
          return (
            <button
              key={m.id}
              type="button"
              id={`mood-btn-${m.id.toLowerCase()}`}
              onClick={() => onMoodChange(m.id)}
              aria-label={`Set mood to ${m.label}`}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 hover:scale-[1.05] active:scale-95 focus:outline-none focus:ring-2 focus:ring-accentPurple/40 ${
                isActive
                  ? `${m.activeClass} shadow-md ring-2 ring-accentPurple/20`
                  : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {m.emoji}
              </span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
