import { useState, useCallback, type ReactNode } from 'react';
import { AuthContext, getCurrentUser, login as doLogin, signup as doSignup, logout as doLogout, type User } from '@/lib/authStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser);

  const login = useCallback((email: string, password: string) => {
    const result = doLogin(email, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const signup = useCallback((data: Parameters<typeof doSignup>[0]) => {
    const result = doSignup(data);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
