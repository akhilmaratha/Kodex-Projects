import { useSession } from "../context/SessionContext";
import SessionCard from "./SessionCard";

const SessionList = () => {
  const { sessions } = useSession();

  return (
    <section className="session-list">
      <div className="session-list__header">
        <p className="session-list__eyebrow">Your plan</p>
        <h2 className="session-list__title">Upcoming Sessions</h2>
      </div>

      <div className="session-list__grid">
        {sessions.length === 0 ? (
          <p className="session-list__empty">No sessions yet. Add one above to build your study streak.</p>
        ) : (
          sessions.map((s) => <SessionCard key={s.id} session={s} />)
        )}
      </div>
    </section>
  );
};

export default SessionList; 