export type VaccinationRecord = unknown;

export type Pet = {
  petId: string;
  name: string;
  species: string;
  breed: string;
  age: number | null;
  ownerId: string;
  ownerName?: string;
  vaccinationRecords: VaccinationRecord[];
  medicalNotes: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

