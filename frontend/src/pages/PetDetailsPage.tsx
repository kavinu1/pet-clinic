import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import PageShell from '../components/PageShell';
import { api } from '../api/api';
import { useAuth } from '../auth/useAuth';
import type { Pet } from '../types/petTypes';

export default function PetDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get(`/pets/${id}`)
      .then((r) => {
        if (!active) return;
        setPet(r.data?.pet || null);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.response?.data?.error || 'Failed to load pet');
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <PageShell>
      <>
        {error ? <p className="alert alert-error">{error}</p> : null}
        {!pet && !error ? <p className="muted">Loading…</p> : null}
        {pet ? (
          <div className="card">
            <div className="page-header">
              <h1 className="page-title">{pet.name}</h1>
              {user?.role === 'staff' ? (
                <Link className="btn btn-secondary" to={`/staff/pets/${pet.petId}/edit`}>
                  Edit
                </Link>
              ) : null}
            </div>
            <p className="muted">
              {pet.species}
              {pet.breed ? ` • ${pet.breed}` : ''}
              {typeof pet.age === 'number' ? ` • ${pet.age} yrs` : ''}
            </p>
            {user?.role === 'staff' ? <p className="muted">Owner: {pet.ownerName || pet.ownerId}</p> : null}
            <h2 className="section-title">Vaccinations</h2>
            {pet.vaccinationRecords?.length ? (
              <pre className="pre">{JSON.stringify(pet.vaccinationRecords, null, 2)}</pre>
            ) : (
              <p className="muted">No vaccination records.</p>
            )}
            <h2 className="section-title">Medical Notes</h2>
            <pre className="pre">{pet.medicalNotes || '—'}</pre>
          </div>
        ) : null}
      </>
    </PageShell>
  );
}
