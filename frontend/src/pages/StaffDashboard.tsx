import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit2, PawPrint, User, Info, SearchCode } from 'lucide-react';

import PageShell from '../components/PageShell';
import { api } from '../api/api';
import type { Pet } from '../types/petTypes';

import '../styles/dashboard.css';

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
      <div className="dashboard-container">
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title gradient-text">Manage Pets</h1>
          <Link className="btn btn-primary" style={{ gap: '8px' }} to="/staff/pets/new">
            <Plus size={20} /> Add pet
          </Link>
        </div>

        <div className="dashboard-search-container">
          <form className="search-card form-inline" onSubmit={onSearch}>
            <label className="field">
              <span>Pet name</span>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Bella" 
                style={{ background: 'white' }}
              />
            </label>
            <label className="field">
              <span>Owner name</span>
              <input 
                value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)} 
                placeholder="e.g. Alex" 
                style={{ background: 'white' }}
              />
            </label>
            <button className="btn btn-secondary" type="submit" disabled={loading} style={{ gap: '8px', padding: '12px 30px' }}>
              <Search size={18} /> {loading ? 'Searching…' : 'Search'}
            </button>
          </form>
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
                  <User size={16} />
                  <span>Owner: {p.ownerName || p.ownerId}</span>
                </div>
              </div>

              <div className="pet-card-actions">
                <Link className="btn btn-secondary" style={{ gap: '6px', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '12px' }} to={`/pets/${p.petId}`}>
                  <Eye size={16} /> View
                </Link>
                <Link className="btn btn-secondary" style={{ gap: '6px', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '12px' }} to={`/staff/pets/${p.petId}/edit`}>
                  <Edit2 size={16} /> Edit
                </Link>
              </div>
            </div>
          ))}
        </div>

        {pets.length === 0 && !error && !loading ? (
          <div className="empty-dashboard">
            <SearchCode size={48} className="empty-icon" />
            <p>No pets found matching your search criteria.</p>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
