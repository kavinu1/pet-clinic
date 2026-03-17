import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import PageShell from '../components/PageShell';
import { api } from '../api/api';
import type { Pet } from '../types/petTypes';

type ClientUser = { uid: string; name: string; email: string };

export default function PetFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientUser[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    ownerId: '',
    vaccinationRecordsJson: '[]',
    medicalNotes: '',
  });

  const payload = useMemo(() => {
    let vaccinationRecords: unknown = [];
    try {
      vaccinationRecords = JSON.parse(form.vaccinationRecordsJson || '[]');
    } catch {
      vaccinationRecords = null;
    }
    return {
      name: form.name,
      species: form.species,
      breed: form.breed,
      age: form.age === '' ? undefined : Number(form.age),
      ownerId: form.ownerId,
      vaccinationRecords,
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
          vaccinationRecordsJson: JSON.stringify(loaded?.vaccinationRecords || [], null, 2),
          medicalNotes: loaded?.medicalNotes || '',
        });
      })
      .catch((e) => setError(e?.response?.data?.error || 'Failed to load pet'));
  }, [editing, id]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (!Array.isArray(payload.vaccinationRecords)) {
        throw new Error('Vaccination records must be valid JSON array');
      }
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
      <div className="card">
        <div className="page-header">
          <h1 className="page-title">{editing ? 'Edit Pet' : 'Add Pet'}</h1>
          {editing && pet ? (
            <Link className="btn btn-secondary" to={`/pets/${pet.petId}`}>
              View
            </Link>
          ) : null}
        </div>

        {error ? <p className="alert alert-error">{error}</p> : null}

        <form className="form" onSubmit={onSubmit}>
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
                <option key={c.uid} value={c.uid}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Pet name</span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </label>
          <label className="field">
            <span>Species</span>
            <input
              value={form.species}
              onChange={(e) => setForm((f) => ({ ...f, species: e.target.value }))}
              required
            />
          </label>
          <label className="field">
            <span>Breed</span>
            <input value={form.breed} onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))} />
          </label>
          <label className="field">
            <span>Age</span>
            <input
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              type="number"
              min={0}
              step={1}
            />
          </label>

          <label className="field">
            <span>Vaccination records (JSON array)</span>
            <textarea
              value={form.vaccinationRecordsJson}
              onChange={(e) => setForm((f) => ({ ...f, vaccinationRecordsJson: e.target.value }))}
              rows={8}
            />
          </label>

          <label className="field">
            <span>Medical notes</span>
            <textarea
              value={form.medicalNotes}
              onChange={(e) => setForm((f) => ({ ...f, medicalNotes: e.target.value }))}
              rows={6}
            />
          </label>

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
