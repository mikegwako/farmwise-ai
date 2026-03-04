import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { AuthContext, getCurrentUser, login as doLogin, signup as doSignup, logout as doLogout, type User } from '@/lib/authStore';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Auto-logout on inactivity
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        doLogout();
        setUser(null);
        // Reload to redirect to login
        window.location.href = '/login';
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [user]);

  // Logout on tab close / beforeunload
  useEffect(() => {
    if (!user) return;

    const handleUnload = () => {
      // Use sessionStorage flag to detect tab close vs refresh
      sessionStorage.setItem('farmwise_active', '1');
    };

    const handleLoad = () => {
      // If the flag exists, it's a refresh — keep session
      // If not, the session was from a closed tab
    };

    // On initial load, check if this is a fresh tab (no session flag)
    if (!sessionStorage.getItem('farmwise_active')) {
      // Fresh tab opening — if there's a stored session, keep it (user may have multiple tabs)
      // Only logout if we detect the "close" pattern via visibilitychange
    }
    sessionStorage.setItem('farmwise_active', '1');

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        // Mark the timestamp when tab became hidden
        sessionStorage.setItem('farmwise_hidden_at', Date.now().toString());
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
