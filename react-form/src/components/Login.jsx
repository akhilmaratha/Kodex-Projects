function Login({ toggleForm }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Submitted");
  };

  return (
    <div className="card">

      <h1>Welcome back</h1>
      <p className="subtitle">Sign in to your account</p>

      <form onSubmit={handleSubmit}>

        <label>Email</label>
        <input type="email" placeholder="you@example.com" required />

        <label>Password</label>
        <input type="password" placeholder="********" required />

        <button type="submit">Login in</button>

      </form>

      <p className="switch">
        Don't have an account? 
        <span onClick={toggleForm}> Sign up</span>
      </p>

    </div>
  );
}

export default Login;