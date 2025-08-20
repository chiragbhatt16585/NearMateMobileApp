export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  provider: 'google' | 'phone';
};


