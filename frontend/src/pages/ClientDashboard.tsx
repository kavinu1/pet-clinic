import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageShell from '../components/PageShell';
import { api } from '../api/api';
import type { Pet } from '../types/petTypes';

export default function ClientDashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get('/pets')
      .then((r) => {
        if (!active) return;
        setPets(r.data?.pets || []);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.response?.data?.error || 'Failed to load pets');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell>
      <>
        <h1 className="page-title">My Pets</h1>
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
              <Link className="btn btn-secondary" to={`/pets/${p.petId}`}>
                View record
              </Link>
            </div>
          ))}
          {pets.length === 0 && !error ? <p className="muted">No pets found.</p> : null}
        </div>
      </>
    </PageShell>
  );
}
