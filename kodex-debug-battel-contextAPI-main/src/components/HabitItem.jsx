import { useState } from "react";
import { useHabit } from "../context/HabitContext";

const HabitItem = ({ habit }) => {
  const { toggleHabit, deleteHabit, updateHabit, getStreak } = useHabit();

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(habit);

  const today = new Date().toISOString().split("T")[0];
  const isDoneToday = habit.completedDates.includes(today);
  const priority = habit.priorityLevel || "Medium";
  const category = habit.category || "General";
  const goalText = habit.goalValue
    ? `${habit.goalValue} ${habit.unit || "mins"}`
    : "No goal set";

  const handleSave = () => {
    updateHabit(habit.id, editData);
    setEditing(false);
  };

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)] sm:p-6">
      {editing ? (
        <div className="space-y-3">
          <input
            value={editData.name}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-full bg-[#5b3df5] px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditData(habit);
                setEditing(false);
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {category}
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
                {priority}
              </span>
            </div>

            <div className="text-right">
              <div className="text-2xl font-semibold leading-none text-slate-900">
                {getStreak(habit.completedDates)}
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                Streak
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
              {habit.name}
            </h3>
            {habit.motivation ? (
              <p className="mt-4 border-l-2 border-slate-200 pl-4 text-sm leading-6 text-slate-500">
                {habit.motivation}
              </p>
            ) : null}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Goal
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{goalText}</p>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex items-center justify-between gap-4 sm:mr-auto">
              <button
                onClick={() => setEditing(true)}
                className="text-base font-medium border border-black px-2 py-1 bg-green-500 text-white transition hover:text-slate-950"
              >
                Edit
              </button>

              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-base font-medium border border-black px-2 py-1 bg-red-500 text-white transition hover:text-slate-950"
              >
                Delete
              </button>
            </div>

            <button
              onClick={() => toggleHabit(habit.id)}
              className="rounded-lg bg-[#5b3df5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f31ea]"
            >
              {isDoneToday ? "Undo" : "Complete"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default HabitItem;