import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Pencil, 
  ShieldCheck, 
  FileText, 
  User, 
  Settings,
  Activity,
  Heart,
  Calendar,
  Dog,
  Cat,
  ClipboardList
} from 'lucide-react';

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

  const getSpeciesIcon = (species?: string) => {
    const s = species?.toLowerCase();
    if (s === 'dog') return <Dog size={48} />;
    if (s === 'cat') return <Cat size={48} />;
    return <Heart size={48} />;
  };

  return (
    <PageShell>
      <div className="pet-details-layout">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={18} />
          Back to Records
        </Link>

        {error ? (
          <div className="alert alert-error glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
            <p>{error}</p>
          </div>
        ) : null}

        {!pet && !error ? (
          <div className="no-data-state glass" style={{ borderRadius: 'var(--radius-md)' }}>
            <Activity className="animate-pulse" size={48} />
            <p>Loading pet records...</p>
          </div>
        ) : null}

        {pet ? (
          <>
            {/* Hero Section */}
            <div className="pet-hero-card glass">
              <div className="pet-hero-info">
                <h1>{pet.name}</h1>
                <div className="pet-badges">
                  <span className="badge badge-blue">
                    {pet.species === 'Dog' ? <Dog size={14} /> : pet.species === 'Cat' ? <Cat size={14} /> : <Heart size={14} />}
                    {pet.species}
                  </span>
                  {pet.breed && (
                    <span className="badge badge-teal">
                      <Settings size={14} />
                      {pet.breed}
                    </span>
                  )}
                  {typeof pet.age === 'number' && (
                    <span className="badge badge-purple">
                      <Calendar size={14} />
                      {pet.age} years old
                    </span>
                  )}
                </div>
              </div>
              <div className="pet-hero-actions">
                <div className="card-icon" style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--accent)', color: 'var(--primary)' }}>
                  {getSpeciesIcon(pet.species)}
                </div>
              </div>
            </div>

            <div className="details-grid">
              {/* Owner Card (Only for staff) */}
              {user?.role === 'staff' && (
                <div className="info-card glass">
                  <div className="card-header">
                    <div className="card-icon">
                      <User size={20} />
                    </div>
                    <h2>Owner Information</h2>
                  </div>
                  <div className="owner-info">
                    <div className="owner-avatar">
                      {(pet.ownerName || pet.ownerId || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="owner-details">
                      <p className="owner-label">Primary Contact</p>
                      <p className="owner-name">{pet.ownerName || pet.ownerId}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                     <Link className="btn btn-secondary btn-full btn-icon" to={`/staff/pets/${pet.petId}/edit`}>
                      <Pencil size={18} />
                      Edit Records
                    </Link>
                  </div>
                </div>
              )}

              {/* Vaccinations Card */}
              <div className="info-card glass">
                <div className="card-header">
                  <div className="card-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <h2>Vaccinations</h2>
                </div>
                {pet.vaccinationRecords?.length ? (
                  <div className="vaccination-list">
                    {pet.vaccinationRecords.map((record: any, idx: number) => (
                      <div key={idx} className="vaccination-item">
                        <div>
                          <p style={{ fontWeight: 600, margin: 0 }}>{record.name || 'Vaccine'}</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{record.date || 'No date'}</p>
                        </div>
                        <ShieldCheck size={18} style={{ color: '#10b981' }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-state">
                    <ShieldCheck size={32} />
                    <p>No vaccination records found.</p>
                  </div>
                )}
              </div>

              {/* Medical Notes Card */}
              <div className="info-card glass" style={user?.role !== 'staff' ? { gridColumn: 'span 2' } : {}}>
                <div className="card-header">
                  <div className="card-icon">
                    <FileText size={20} />
                  </div>
                  <h2>Medical Notes</h2>
                </div>
                {pet.medicalNotes && pet.medicalNotes !== '—' ? (
                  <div className="medical-notes-content">
                    {pet.medicalNotes}
                  </div>
                ) : (
                  <div className="no-data-state">
                    <ClipboardList size={32} />
                    <p>No medical notes available.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
