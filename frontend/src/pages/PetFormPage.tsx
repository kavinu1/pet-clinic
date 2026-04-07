import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PawPrint, ClipboardList, Stethoscope, Plus, Trash2, X } from 'lucide-react';

import PageShell from '../components/PageShell';
import { api } from '../api/api';
import type { Pet, VaccinationRecord } from '../types/petTypes';

import '../styles/petForm.css';

type ClientUser = { uid: string; name: string; email: string };

export default function PetFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientUser[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    ownerId: '',
    vaccinationRecords: [] as VaccinationRecord[],
    medicalNotes: '',
  });

  // Local state for the "Add New" record inputs
  const [newVac, setNewVac] = useState<VaccinationRecord>({
    date: new Date().toISOString().split('T')[0],
    vaccine: '',
    notes: '',
  });

  const payload = useMemo(() => {
    return {
      name: form.name,
      species: form.species,
      breed: form.breed,
      age: form.age === '' ? undefined : Number(form.age),
      ownerId: form.ownerId,
      vaccinationRecords: form.vaccinationRecords,
      medicalNotes: form.medicalNotes,
    };
  }, [form]);

  useEffect(() => {
    api
      .get('/users')
      .then((r) => setClients(r.data?.users || []))
      .catch((e) => setError(e?.response?.data?.error || 'Failed to load clients'));
  }, []);

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/pets/${id}`)
      .then((r) => {
        const loaded = r.data?.pet as Pet;
        setPet(loaded);
        setForm({
          name: loaded?.name || '',
          species: loaded?.species || '',
          breed: loaded?.breed || '',
          age: typeof loaded?.age === 'number' ? String(loaded.age) : '',
          ownerId: loaded?.ownerId || '',
          vaccinationRecords: loaded?.vaccinationRecords || [],
          medicalNotes: loaded?.medicalNotes || '',
        });
      })
      .catch((e) => setError(e?.response?.data?.error || 'Failed to load pet'));
  }, [editing, id]);

  const addVaccination = () => {
    if (!newVac.vaccine || !newVac.date) return;
    setForm((f) => ({
      ...f,
      vaccinationRecords: [...f.vaccinationRecords, newVac],
    }));
    setNewVac({
      date: new Date().toISOString().split('T')[0],
      vaccine: '',
      notes: '',
    });
  };

  const removeVaccination = (index: number) => {
    setForm((f) => ({
      ...f,
      vaccinationRecords: f.vaccinationRecords.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (!payload.ownerId) throw new Error('Owner is required');

      if (editing) {
        await api.put(`/pets/${id}`, payload);
        navigate(`/pets/${id}`, { replace: true });
      } else {
        const resp = await api.post('/pets', payload);
        const createdId = resp.data?.pet?.petId as string;
        navigate(`/pets/${createdId}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="pet-form-container">
        <div className="card glass">
          <div className="page-header">
            <h1 className="page-title gradient-text">{editing ? 'Edit Pet Profile' : 'Register New Pet'}</h1>
            {editing && pet ? (
              <Link className="btn btn-outline" style={{ borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }} to={`/pets/${pet.petId}`}>
                <X size={18} /> Cancel
              </Link>
            ) : null}
          </div>

          {error ? <p className="alert alert-error">{error}</p> : null}

          <form className="form" onSubmit={onSubmit}>
            <div className="section-header">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PawPrint size={20} /> Basic Information
              </h3>
            </div>

            <label className="field">
              <span>Owner (Client)</span>
              <select
                value={form.ownerId}
                onChange={(e) => setForm((f) => ({ ...f, ownerId: e.target.value }))}
                required
              >
                <option value="" disabled>
                  Select a client…
                </option>
                {clients.map((c) => (
                  <option key={c.uid} value={c.uid} style={{ background: '#0f172a' }}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </label>

            <div className="pet-form-grid">
              <label className="field">
                <span>Pet Name</span>
                <input
                  placeholder="e.g. Buddy"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>
              <label className="field">
                <span>Species</span>
                <input
                  placeholder="e.g. Dog, Cat, Rabbit"
                  value={form.species}
                  onChange={(e) => setForm((f) => ({ ...f, species: e.target.value }))}
                  required
                />
              </label>
              <label className="field">
                <span>Breed</span>
                <input
                  placeholder="e.g. Golden Retriever"
                  value={form.breed}
                  onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
                />
              </label>
              <label className="field">
                <span>Age (Years)</span>
                <input
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                  type="number"
                  min={0}
                  step={1}
                />
              </label>
            </div>

            <div className="section-header">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ClipboardList size={20} /> Vaccination History
              </h3>
            </div>

            <div className="vaccination-list">
              {form.vaccinationRecords.length === 0 ? (
                <div className="empty-state">No vaccination records added yet.</div>
              ) : (
                form.vaccinationRecords.map((record, idx) => (
                  <div key={idx} className="vaccination-item">
                    <div className="item-date">{record.date}</div>
                    <div className="item-details">
                      <h4>{record.vaccine}</h4>
                      {record.notes && <p className="item-notes">{record.notes}</p>}
                    </div>
                    <button type="button" className="btn-remove" onClick={() => removeVaccination(idx)} title="Remove record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="add-vaccination-row">
              <label className="field" style={{ marginBottom: 0 }}>
                <span>Date</span>
                <input
                  type="date"
                  value={newVac.date}
                  onChange={(e) => setNewVac((v) => ({ ...v, date: e.target.value }))}
                />
              </label>
              <label className="field" style={{ marginBottom: 0 }}>
                <span>Vaccine Name</span>
                <input
                  placeholder="Rabies, Parvo, etc."
                  value={newVac.vaccine}
                  onChange={(e) => setNewVac((v) => ({ ...v, vaccine: e.target.value }))}
                />
              </label>
              <label className="field" style={{ marginBottom: 0 }}>
                <span>Notes (Optional)</span>
                <input
                  placeholder="Booster due in 1yr"
                  value={newVac.notes}
                  onChange={(e) => setNewVac((v) => ({ ...v, notes: e.target.value }))}
                />
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ borderRadius: '12px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={addVaccination}
                disabled={!newVac.vaccine}
              >
                <Plus size={18} /> Add Record
              </button>
            </div>

            <div className="section-header">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Stethoscope size={20} /> Medical Notes
              </h3>
            </div>

            <label className="field">
              <textarea
                placeholder="Allergies, chronic conditions, or recent procedures..."
                value={form.medicalNotes}
                onChange={(e) => setForm((f) => ({ ...f, medicalNotes: e.target.value }))}
                rows={4}
              />
            </label>

            <div style={{ marginTop: '2rem' }}>
              <button className="btn btn-primary btn-full" type="submit" disabled={submitting}>
                {submitting ? 'Saving Profile...' : editing ? 'Update Pet Profile' : 'Register Pet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
