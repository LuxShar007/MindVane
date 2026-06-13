/**
 * @fileoverview WellnessHistory — reads the last 7 analysis entries from
 * localStorage and renders a compact wellness timeline to fulfil the
 * "tracker" aspect of the Mental Wellness Tracker challenge.
 */

import { Activity } from 'lucide-react';

/** localStorage key used across the app */
export const HISTORY_STORAGE_KEY = 'mindvane_wellness_history';

/** Maximum entries kept in local history */
const MAX_HISTORY_ENTRIES = 7;

/**
 * Mood emoji map for rendering history mood icons.
 * @type {Object<string, string>}
 */
const MOOD_EMOJI = {
  Happy: '😊',
  Sad: '😔',
  Anxious: '😰',
  Tired: '🥱',
  Angry: '😡',
};

/**
 * Derives a Tailwind color class from an anxiety score.
 *
 * @param {number} score
 * @returns {{ text: string, bg: string }}
 */
function getScoreColors(score) {
  if (score < 40) return { text: 'text-emerald-500', bg: 'bg-emerald-500/20' };
  if (score < 75) return { text: 'text-amber-500', bg: 'bg-amber-500/20' };
  return { text: 'text-rose-500', bg: 'bg-rose-500/20' };
}

/**
 * Appends a new wellness entry to localStorage history, capping at MAX_HISTORY_ENTRIES.
 *
 * @param {{ exam: string, mood: string, anxietyScore: number }} entry
 */
export function appendWellnessEntry({ exam, mood, anxietyScore }) {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    const newEntry = {
      exam,
      mood,
      anxietyScore,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [newEntry, ...existing].slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage not available in this environment — fail silently
  }
}

/**
 * Reads the wellness history from localStorage.
 *
 * @returns {Array<{exam: string, mood: string, anxietyScore: number, date: string, time: string}>}
 */
function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * WellnessHistory — displays the last 7 tracked wellness entries as a
 * compact timeline card.
 *
 * @returns {JSX.Element|null}
 */
export default function WellnessHistory() {
  const history = readHistory();
  if (history.length === 0) return null;

  return (
    <section
      aria-labelledby="wellness-history-heading"
      className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-accentPurple" aria-hidden="true" />
        <h2
          id="wellness-history-heading"
          className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold"
        >
          Wellness History (Last {history.length} Session{history.length > 1 ? 's' : ''})
        </h2>
      </div>

      <ol className="space-y-2" role="list" aria-label="Recent wellness entries">
        {history.map((entry, idx) => {
          const colors = getScoreColors(entry.anxietyScore);
          return (
            <li
              key={idx}
              className="flex items-center justify-between bg-zinc-50 dark:bg-black/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl px-4 py-2.5 gap-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-lg leading-none"
                  aria-label={`Mood: ${entry.mood}`}
                  title={entry.mood}
                >
                  {MOOD_EMOJI[entry.mood] || '😐'}
                </span>
                <div>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {entry.exam}
                  </span>
                  <span className="block text-[10px] text-zinc-500 dark:text-zinc-500 font-mono">
                    {entry.date} · {entry.time}
                  </span>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}
                aria-label={`Anxiety score: ${entry.anxietyScore}`}
              >
                {entry.anxietyScore}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
