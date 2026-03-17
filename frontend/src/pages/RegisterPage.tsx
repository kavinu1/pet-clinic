import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageShell from "../components/PageShell";
import { useAuth } from "../auth/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ name, email, password, role: "client" });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell mainClassName="container">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join us to book appointments and track your pet's wellness.
            </p>
          </div>

          {error ? <p className="alert alert-error">{error}</p> : null}

          <form className="form" onSubmit={onSubmit}>
            <label className="field">
              <span>Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </label>
            <label className="field">
              <span>Email Address</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                required
              />
            </label>
            <button
              className="btn btn-primary btn-full mt-4"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
