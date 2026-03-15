import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./components/Form.css";

function App() {

  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="container">

      {isLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <Register toggleForm={toggleForm} />
      )}

    </div>
  );
}

export default App;