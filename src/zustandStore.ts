import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCookie, getCookie, deleteCookie  } from 'cookies-next';

interface User {
  name: string;
  profilePicture: string;
  token: string;
  role: string;
}
interface StoreState {
  token: string;
  name: string;
  profilePicture: string;
  role: string; 
  setToken: (token: string) => void;
  setName: (name: string) => void;
  setProfilePicture: (profilePicture: string) => void;
  setRole: (role: string) => void; 
  setUser: (user: User) => void;
  loadUserFromStorage: () => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      token: '',
      name: '',
      profilePicture: '',
      role: '',

      setToken: (token) => {
        set({ token });
        setCookie('access_token', token, { maxAge: 7 * 24 * 60 * 60, path: '/' });
      },

      setName: (name) => {
        set({ name });
      },

      setProfilePicture: (profilePicture) => {
        set({ profilePicture });
      },

      setRole: (role) => {
        set({ role });
      },

      setUser: (user) => {
        set({
          token: user.token,
          name: user.name,
          profilePicture: user.profilePicture,
          role: user.role, 
        });
        setCookie('access_token', user.token, { maxAge: 7 * 24 * 60 * 60, path: '/' });
      },

      loadUserFromStorage: () => {
        const token = getCookie('access_token')?.toString() || '';
        const name = localStorage.getItem('user_name') || '';
        const profilePicture = localStorage.getItem('profile_picture') || '';
        const role = localStorage.getItem('role') || '';

        set({ token, name, profilePicture, role });
      },

      logout: () => {
        set({
          token: '',
          name: '',
          profilePicture: '',
          role: '',
        });
        deleteCookie('access_token', { path: '/' });
        localStorage.removeItem('user_name');
        localStorage.removeItem('profile_picture');
        localStorage.removeItem('role');
      },
    }),
    {
      name: 'user-storage', 
      getStorage: () => localStorage,
      partialize: (state) => ({
        name: state.name,
        profilePicture: state.profilePicture,
        role: state.role,
      }),
    }
  )
);
