import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  role: 'Admin' | 'Editor' | 'Member';
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: 'Admin' | 'Editor' | 'Member') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, role: 'Admin' | 'Editor' | 'Member') => {
    setUser({ name, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
