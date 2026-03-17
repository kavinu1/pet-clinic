import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import PageShell from '../components/PageShell';
import { api } from '../api/api';
import type { Pet } from '../types/petTypes';

export default function StaffDashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (name.trim()) params.set('name', name.trim());
    if (ownerName.trim()) params.set('ownerName', ownerName.trim());
    return params.toString();
  }, [name, ownerName]);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const resp = await api.get(`/pets${query ? `?${query}` : ''}`);
      setPets(resp.data?.pets || []);
    } catch (e: unknown) {
      const maybeAxios = e as { response?: { data?: { error?: string } } };
      setError(maybeAxios?.response?.data?.error || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    load();
  };

  return (
    <PageShell>
      <>
        <div className="page-header">
          <h1 className="page-title">Manage Pets</h1>
          <Link className="btn btn-primary" to="/staff/pets/new">
            Add pet
          </Link>
        </div>

        <form className="card form-inline" onSubmit={onSearch}>
          <label className="field">
            <span>Pet name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bella" />
          </label>
          <label className="field">
            <span>Owner name</span>
            <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Alex" />
          </label>
          <button className="btn btn-secondary" type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {error ? <p className="alert alert-error">{error}</p> : null}
        <div className="grid">
          {pets.map((p) => (
            <div className="card" key={p.petId}>
              <h2 className="card-title">{p.name}</h2>
              <p className="muted">
                {p.species}
                {p.breed ? ` • ${p.breed}` : ''}
                {typeof p.age === 'number' ? ` • ${p.age} yrs` : ''}
              </p>
              <p className="muted">Owner: {p.ownerName || p.ownerId}</p>
              <div className="row">
                <Link className="btn btn-secondary" to={`/pets/${p.petId}`}>
                  View
                </Link>
                <Link className="btn btn-secondary" to={`/staff/pets/${p.petId}/edit`}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
          {pets.length === 0 && !error ? <p className="muted">No pets found.</p> : null}
        </div>
      </>
    </PageShell>
  );
}
