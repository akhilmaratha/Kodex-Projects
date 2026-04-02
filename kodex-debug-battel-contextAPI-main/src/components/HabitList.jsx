import { useHabit } from "../context/HabitContext";
import HabitItem from "./HabitItem";

const HabitList = () => {
  const { habits, showAll, setShowAll } = useHabit();

  const today = new Date().toISOString().split("T")[0];

  const completedToday = habits.filter((h) =>
    h.completedDates.includes(today),
  ).length;

  const totalToday = Math.max(habits.length, 1);
  const progressPercent = Math.round((completedToday / totalToday) * 100);

  const topCategory =
    habits.reduce((acc, h) => {
      const category = h.category || "General";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

  const mainFocus =
    Object.keys(topCategory).length > 0
      ? Object.keys(topCategory).reduce((a, b) =>
          topCategory[a] < topCategory[b] ? b : a,
        )
      : "-";

  const visibleHabits = showAll ? habits : habits.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Daily Progress
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
              Keep going
            </h2>
          </div>

          <div className="pt-3 text-right text-lg font-medium text-slate-500">
            {completedToday} / {totalToday}
          </div>
        </div>

        <div className="mt-6 h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-[#5b3df5] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-6 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Focus
            </p>
            <p className="mt-2 text-xl font-medium text-slate-900">{mainFocus}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Priority
            </p>
            <p className="mt-2 text-xl font-medium text-slate-900">
              {habits.filter((habit) => (habit.priorityLevel || "Medium") === "High").length} High Tasks
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
          Your Routine
        </div>

        <div className="space-y-4">
          {visibleHabits.length > 0 ? (
            visibleHabits.map((habit) => <HabitItem key={habit.id} habit={habit} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              No habits yet. Add one in the form to get started.
            </div>
          )}
        </div>

        {habits.length > 3 && (
          <button
            type="button"
            className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        )}
      </section>
    </div>
  );
};

export default HabitList;