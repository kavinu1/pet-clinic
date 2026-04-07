import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Info, Eye, ClipboardList } from 'lucide-react';

import PageShell from '../components/PageShell';
import { api } from '../api/api';
import type { Pet } from '../types/petTypes';

import '../styles/dashboard.css';

export default function ClientDashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get('/pets')
      .then((r) => {
        if (!active) return;
        setPets(r.data?.pets || []);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.response?.data?.error || 'Failed to load pets');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell>
      <div className="dashboard-container">
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title gradient-text">My Pets</h1>
        </div>

        {error ? <p className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</p> : null}

        <div className="grid">
          {pets.map((p) => (
            <div className="pet-card" key={p.petId}>
              <div className="pet-card-header">
                <div className="pet-card-icon">
                  <PawPrint size={24} />
                </div>
                <h2 className="pet-card-title">{p.name}</h2>
              </div>
              
              <div className="pet-card-info">
                <div className="info-item">
                  <Info size={16} />
                  <span>{p.species}{p.breed ? ` • ${p.breed}` : ''}</span>
                </div>
                {typeof p.age === 'number' && (
                  <div className="info-item">
                    <span style={{ marginLeft: '24px' }}>{p.age} years old</span>
                  </div>
                )}
                <div className="info-item">
                  <ClipboardList size={16} />
                  <span>{p.vaccinationRecords?.length || 0} Vaccination records</span>
                </div>
              </div>

              <div className="client-pet-card-actions">
                <Link className="btn btn-secondary btn-full" style={{ gap: '8px' }} to={`/pets/${p.petId}`}>
                  <Eye size={18} /> View Record
                </Link>
              </div>
            </div>
          ))}
        </div>

        {pets.length === 0 && !error && !loading ? (
          <div className="empty-dashboard">
            <PawPrint size={48} className="empty-icon" />
            <p>You haven't registered any pets yet.</p>
          </div>
        ) : null}

        {loading && <p className="muted text-center">Loading your pets...</p>}
      </div>
    </PageShell>
  );
}
