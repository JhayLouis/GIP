const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

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

const AUTH_TOKEN_KEY = 'soft_projects_auth_token';
const USER_DATA_KEY = 'soft_projects_user_data';

const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1] || ''));
  } catch {
    return null;
  }
};

const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;
  return Date.now() < decoded.exp * 1000;
};

export const login = async (username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Login failed'
      };
    }

    const user: User = {
      id: data.user?.id || data.data?.user?.id || '',
      username: data.user?.username || data.data?.user?.username || '',
      role: data.user?.role || data.data?.user?.role || 'user',
      name: data.user?.name || data.data?.user?.name || ''
    };

    const token = data.token || data.data?.token || '';

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

    return { success: true, user, token };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
};

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
  if (!authState.isAuthenticated || !authState.user || !authState.token) {
    return false;
  }

  if (!isTokenValid(authState.token)) {
    logout();
    return false;
  }

  return true;
};
