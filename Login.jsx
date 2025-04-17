import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // Username or Email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(identifier, password);
      alert("Login successful!");
    } catch (error) {
      alert(`Login Failed: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="login-card">
        <h2>🔒 Login to Your Todo App</h2>
        <form onSubmit={handleLogin}>

          {/* Identifier Input (Username or Email) */}
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
            type="button"
            className="show-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
          

          <button type="submit" className="auth-button">Login</button>

<br></br><br></br>
          <p>
            Don't have an account? <a href="/signup" className="link-button">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
