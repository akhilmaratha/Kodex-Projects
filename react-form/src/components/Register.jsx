function Register({ toggleForm }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Register Submitted");
  };

  return (
    <div className="card">

      <h1>Create account</h1>
      <p className="subtitle">Join us today</p>

      <form onSubmit={handleSubmit}>

        <label>Full Name</label>
        <input type="text" placeholder="John Doe" required />

        <label>Email</label>
        <input type="email" placeholder="you@example.com" required />

        <label>Password</label>
        <input type="password" placeholder="********" required />

        <button type="submit">Sign up</button>

      </form>

      <p className="switch">
        Already have an account? 
        <span onClick={toggleForm}> Sign in</span>
      </p>

    </div>
  );
}

export default Register;