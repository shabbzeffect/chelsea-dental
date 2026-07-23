import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { db, schema } from '@/db';
import { eq, and, gte, lte } from 'drizzle-orm';

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const COOKIE_NAME = 'session_token';

// ============================================================
// PASSWORD UTILITIES
// ============================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================

export async function createSession(userId: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Clean up expired sessions for this user
  await db.delete(schema.sessions)
    .where(
      and(
        eq(schema.sessions.userId, userId),
        lte(schema.sessions.expiresAt, new Date())
      )
    );

  // Create new session
  await db.insert(schema.sessions).values({
    userId,
    token,
    expiresAt,
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/',
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await db.query.sessions.findFirst({
    where: and(
      eq(schema.sessions.token, token),
      gte(schema.sessions.expiresAt, new Date())
    ),
    with: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  return {
    session,
    user: session.user,
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await db.delete(schema.sessions).where(
      eq(schema.sessions.token, token)
    );
  }

  cookieStore.delete(COOKIE_NAME);
}

// ============================================================
// AUTHORIZATION
// ============================================================

export type UserRole = 'admin' | 'dentist' | 'receptionist' | 'patient';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  dentist: [
    'patients:read',
    'patients:update',
    'appointments:read',
    'appointments:update',
    'treatments:create',
    'treatments:read',
    'treatments:update',
  ],
  receptionist: [
    'patients:read',
    'patients:create',
    'patients:update',
    'appointments:read',
    'appointments:create',
    'appointments:update',
    'invoices:read',
    'invoices:create',
    'payments:create',
  ],
  patient: [
    'appointments:read',
    'appointments:create',
    'appointments:cancel',
    'treatments:read',
    'invoices:read',
    'payments:read',
    'profile:read',
    'profile:update',
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes('*')) return true;
  return permissions.includes(permission);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth();
  const user = session.user as any;
  if (!roles.includes(user.role as UserRole)) {
    throw new Error('Forbidden');
  }
  return session;
}
