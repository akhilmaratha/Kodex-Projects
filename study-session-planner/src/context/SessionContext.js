import { createContext, createElement, useContext, useState } from "react";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);

  const addSession = (session) => {
    setSessions((prev) => [...prev, { id: Date.now(), ...session }]);
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return createElement(
    SessionContext.Provider,
    { value: { sessions, addSession, deleteSession } },
    children
  );
};
