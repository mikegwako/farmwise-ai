// localStorage-based authentication system
import { createContext, useContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'buyer';
  county: string;
  createdAt: string;
}

const USERS_KEY = 'farmwise_users';
const SESSION_KEY = 'farmwise_session';

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(data: { name: string; email: string; phone: string; password: string; role: 'farmer' | 'buyer'; county: string }): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  const user: User = {
    id: `u-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    county: data.county,
    createdAt: new Date().toISOString(),
  };
  // Store password hash (simple base64 for demo — NOT production-safe)
  const allData = JSON.parse(localStorage.getItem(USERS_KEY + '_auth') || '{}');
  allData[data.email] = btoa(data.password);
  localStorage.setItem(USERS_KEY + '_auth', JSON.stringify(allData));

  users.push(user);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return { success: false, error: 'No account found with this email.' };

  const allData = JSON.parse(localStorage.getItem(USERS_KEY + '_auth') || '{}');
  if (allData[email] !== btoa(password)) {
    return { success: false, error: 'Incorrect password.' };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: Parameters<typeof signup>[0]) => { success: boolean; error?: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
