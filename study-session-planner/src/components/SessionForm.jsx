import { useForm } from "react-hook-form";
import { useSession } from "../context/SessionContext";

const SessionForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "DSA",
      priority: "Medium",
    },
  });
  const { addSession } = useSession();

  const onSubmit = (data) => {
    addSession(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="session-form" noValidate>
      <div className="session-form__header">
        <p className="session-form__eyebrow">Build your routine</p>
        <h2 className="session-form__title">Add a Study Session</h2>
      </div>

      <div className="session-form__grid">
        <div className="field field--full">
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            {...register("topic", {
              required: "Topic is required",
              minLength: { value: 3, message: "Use at least 3 characters" },
            })}
            placeholder="e.g. Binary Trees"
            className="input"
          />
          {errors.topic && <p className="field__error">{errors.topic.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="subject">Subject</label>
          <select id="subject" {...register("subject")} className="input">
            <option>DSA</option>
            <option>Web Dev</option>
            <option>DBMS</option>
            <option>OS</option>
            <option>Other</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" {...register("priority")} className="input">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="duration">Duration (min)</label>
          <input
            id="duration"
            type="number"
            {...register("duration", {
              required: "Duration is required",
              min: { value: 10, message: "Minimum duration is 10 minutes" },
              max: { value: 480, message: "Duration cannot exceed 480 minutes" },
              valueAsNumber: true,
            })}
            placeholder="45"
            className="input"
          />
          {errors.duration && <p className="field__error">{errors.duration.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            {...register("date", { required: "Pick a study date" })}
            className="input"
          />
          {errors.date && <p className="field__error">{errors.date.message}</p>}
        </div>
      </div>

      <button type="submit" className="btn">Add Session</button>
    </form>
  );
};

export default SessionForm;
