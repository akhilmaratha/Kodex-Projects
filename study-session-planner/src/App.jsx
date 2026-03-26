import SessionForm from "./components/SessionForm";
import SessionList from "./components/SessionList";

const App = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-4">Study Session Planner</h1>
      <SessionForm />
      <SessionList />
    </div>
  );
};

export default App;