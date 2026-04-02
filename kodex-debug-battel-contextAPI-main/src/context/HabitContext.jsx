import { createContext, useContext, useState } from "react";

const HabitContext = createContext();

const getToday = () => new Date().toISOString().split("T")[0];

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const addHabit = (habit) => {
    const newHabit = {
      id: habit.id ?? crypto.randomUUID(),
      completedDates: [],
      ...habit,
    };

    setHabits((prev) => [...prev, newHabit]);
  };

  const toggleHabit = (id) => {
    const today = getToday();

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const alreadyDone = h.completedDates.includes(today);

        return {
          ...h,
          completedDates: alreadyDone
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      }),
    );
  };

  const getStreak = (completedDates) => {
    let streak = 0;
    let currentDate = new Date();
    const completedSet = new Set(completedDates);

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];

      if (completedSet.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const updateHabit = (id, data) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...data } : h)));
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        toggleHabit,
        updateHabit,
        deleteHabit,
        getStreak,
        showAll,
        setShowAll,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabit must be used within HabitProvider");
  }

  return context;
};