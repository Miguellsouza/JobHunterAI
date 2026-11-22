import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserData {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => UserData | null;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'jobhunter_session_v2';

// E-mail autorizado para perfil administrativo na simulação local
const ADMIN_EMAIL = 'admin@jobhunter.ai';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as UserData) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string): UserData | null => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || password.length < 4) return null;

    const loggedUser: UserData = {
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || password.length < 4) return false;

    const newUser: UserData = {
      name: name.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: 'user',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}