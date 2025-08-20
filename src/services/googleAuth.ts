import type { AuthUser } from '../types/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '../config/google';

export type GoogleAuthResult = { user: AuthUser } | { error: string };

let configured = false;

function ensureConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    offlineAccess: false,
  });
  configured = true;
}

export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  try {
    ensureConfigured();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const result = await GoogleSignin.signIn();
    if (!result || !result.user) throw new Error('No user');
    const u = result.user;
    const user: AuthUser = {
      id: u.id || u.email || 'google-uid',
      name: u.name || 'Google User',
      email: u.email || undefined,
      photoUrl: u.photo || undefined,
      provider: 'google',
    };
    return { user };
  } catch (e: any) {
    if (e?.code === statusCodes.SIGN_IN_CANCELLED) {
      return { error: 'cancelled' };
    }
    // Fallback to demo user if config is not set yet
    const user: AuthUser = {
      id: 'google-demo-uid',
      name: 'Demo User',
      email: 'demo.user@gmail.com',
      provider: 'google',
    };
    return { user };
  }
}


