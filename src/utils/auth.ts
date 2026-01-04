export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin' as const,
    name: 'Admin'
  },
  {
    id: '2',
    username: 'user',
    password: 'user321',
    role: 'admin' as const,
    name: 'User'
  },
  {
    id: '3',
    username: 'user',
    password: 'user123',
    role: 'user' as const,
    name: 'User'
  },
  {
    id: '4',
    username: 'viewer',
    password: 'viewer123',
    role: 'user' as const,
    name: 'Viewer'
  }
];

const AUTH_TOKEN_KEY = 'soft_projects_auth_token';
const USER_DATA_KEY = 'soft_projects_user_data';

const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000)
  };
  return btoa(JSON.stringify(payload));
};

const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;
  return Date.now() < decoded.exp;
};

// MOCK LOGIN IMPLEMENTATION (DEFAULT)
const mockLogin = async (username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const userWithoutPassword = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  };

  const token = generateToken(userWithoutPassword);

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));

  return { success: true, user: userWithoutPassword, token };
};

// ============================================
// SUPABASE AUTH IMPLEMENTATION (COMMENTED OUT)
// ============================================
/*
import { supabase } from './backendService'; // Uncomment when enabling Supabase

const supabaseLogin = async (username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password
    });

    if (error) {
      return { success: false, error: error.message || 'Login failed' };
    }

    if (!data.user || !data.session) {
      return { success: false, error: 'No session created' };
    }

    const user: User = {
      id: data.user.id,
      username: data.user.email || username,
      name: data.user.user_metadata?.name || username,
      role: (data.user.user_metadata?.role as 'admin' | 'user') || 'user'
    };

    localStorage.setItem(AUTH_TOKEN_KEY, data.session.access_token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

    return { success: true, user, token: data.session.access_token };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
  }
};
*/

// EXPORT LOGIN (USES SELECTED IMPLEMENTATION)
export const login = mockLogin;

export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const getAuthState = (): AuthState => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userData = localStorage.getItem(USER_DATA_KEY);

  if (!token || !userData || !isTokenValid(token)) {
    logout();
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }

  try {
    const user = JSON.parse(userData);
    return {
      isAuthenticated: true,
      user,
      token
    };
  } catch {
    logout();
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthState().isAuthenticated;
};

export const getCurrentUser = (): User | null => {
  return getAuthState().user;
};

export const refreshSession = (): boolean => {
  const authState = getAuthState();
  if (!authState.isAuthenticated || !authState.user) {
    return false;
  }

  const newToken = generateToken(authState.user);
  localStorage.setItem(AUTH_TOKEN_KEY, newToken);

  return true;
};
