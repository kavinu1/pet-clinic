import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import { useAuth } from '../auth/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container page-main">
        <div className="card">
          <h1 className="page-title">Login</h1>
          {error ? <p className="alert alert-error">{error}</p> : null}
          <form className="form" onSubmit={onSubmit}>
            <label className="field">
              <span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </label>
            <label className="field">
              <span>Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </label>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Login'}
            </button>
          </form>
          <p className="muted">
            No account? <Link to="/register">Register</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
