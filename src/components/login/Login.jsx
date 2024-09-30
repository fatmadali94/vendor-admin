import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log(import.meta.env.VITE_STATIC_PASS);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      username === import.meta.env.VITE_STATIC_USER &&
      password === import.meta.env.VITE_STATIC_PASS
    ) {
      onLogin();
      localStorage.setItem("isAuthenticated", "true");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url('/admin-login-back.webp')`, // Add url() around the image path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          width: "10rem",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          paddingLeft: "1rem",
        }}
      >
        {/* <h2>Login</h2> */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ width: "100%" }}>
          {/* <label>Username:</label> */}
          <input
            type="text"
            value={username}
            style={{ height: "2rem", width: "100%" }}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{ width: "100%" }}>
          {/* <label>Password:</label> */}
          <input
            type="password"
            value={password}
            style={{ height: "2rem", width: "100%" }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" style={{ padding: ".5rem 1rem" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
