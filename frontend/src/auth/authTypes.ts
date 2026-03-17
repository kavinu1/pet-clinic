export type UserRole = 'client' | 'staff';

export type AuthedUser = {
  uid: string;
  email?: string;
  name: string;
  role: UserRole;
};

