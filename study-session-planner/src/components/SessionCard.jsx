import { useSession } from "../context/SessionContext";

const SessionCard = ({ session }) => {
  const { deleteSession } = useSession();

  const getPriorityClass = () => {
    if (session.priority === "High") return "session-card__priority session-card__priority--high";
    if (session.priority === "Medium") return "session-card__priority session-card__priority--medium";
    return "session-card__priority session-card__priority--low";
  };

  return (
    <article className="session-card">
      <div className="session-card__main">
        <div className="session-card__header">
          <h3 className="session-card__title">{session.topic}</h3>
          <p className={getPriorityClass()}>{session.priority} Priority</p>
        </div>

        <div className="session-card__meta">
          <p className="session-card__chip">{session.subject}</p>
          <p className="session-card__chip">{session.duration} min</p>
          <p className="session-card__chip">{session.date}</p>
        </div>
      </div>

      <button onClick={() => deleteSession(session.id)} className="session-card__delete-btn">
        Delete
      </button>
    </article>
  );
};

export default SessionCard;
