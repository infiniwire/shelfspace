import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Login failed. Check your email and password.");
        return;
      }
      navigate("/library");
    } catch {
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword((prev) => !prev)}
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? "🙈" : "👁"}
  </button>
</div>
  );
}

export default Login;