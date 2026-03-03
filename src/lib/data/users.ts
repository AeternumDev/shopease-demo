import { User } from '@/types';

export const TEST_USERS: User[] = [
  {
    id: 'user-customer-001',
    email: 'kunde@shopease.de',
    role: 'customer',
  },
  {
    id: 'user-admin-001',
    email: 'admin@shopease.de',
    role: 'admin',
  },
];

// Passwort für alle Testuser (nur für Stub-Auth relevant)
export const TEST_PASSWORD = 'testpasswort123';
