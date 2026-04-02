import { useForm } from "react-hook-form";
import { useHabit } from "../context/HabitContext";

const HabitForm = () => {
  const { addHabit } = useHabit();

  const { register, handleSubmit, reset } = useForm();

  const onCommit = (values) => {
    const payload = {
      ...values,
      id: crypto.randomUUID(),
      completedDates: [],
      category: values.category?.trim() || "General",
    };

    addHabit(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onCommit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Add Habit</h2>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Habit Name
        </label>
        <input
          {...register("name")}
          placeholder="e.g. Morning Exercise"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Daily Goal
          </label>
          <input
            {...register("goalValue")}
            type="number"
            placeholder="30"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Unit
          </label>
          <select
            {...register("unit")}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            defaultValue="Minutes"
          >
            <option>Minutes</option>
            <option>Hours</option>
            <option>Pages</option>
            <option>Steps</option>
            <option>Reps</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Start Date
          </label>
          <input
            {...register("startDate")}
            type="date"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            defaultValue="Mindset"
          >
            <option>Mindset</option>
            <option>Fitness</option>
            <option>Productivity</option>
            <option>Health</option>
            <option>Learning</option>
            <option>General</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Motivation
        </label>
        <textarea
          {...register("motivation")}
          placeholder="Why is this important to you?"
          rows={4}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Priority Level
        </label>
        <div className="flex flex-wrap gap-6 text-slate-700">
          {[
            ["Low", "Low"],
            ["Medium", "Medium"],
            ["High", "High"],
          ].map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                value={value}
                {...register("priorityLevel")}
                className="h-4 w-4 border-slate-400 text-indigo-600 focus:ring-indigo-500"
                defaultChecked={value === "Medium"}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        Create Habit
      </button>
    </form>
  );
};

export default HabitForm;