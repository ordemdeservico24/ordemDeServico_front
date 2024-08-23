import { create } from 'zustand';
import { setCookie, getCookie } from 'cookies-next';

interface User {
  name: string;
  profilePicture: string;
  token: string;
}

interface StoreState {
  token: string;
  name: string;
  profilePicture: string;
  setToken: (token: string) => void;
  setName: (name: string) => void;
  setProfilePicture: (profilePicture: string) => void;
  setUser: (user: User) => void;
  loadUserFromStorage: () => void;
}

export const useStore = create<StoreState>((set) => ({
  token: '',
  name: '',
  profilePicture: '',

  setToken: (token) => {
    set({ token });
    setCookie('access_token', token, { maxAge: 7 * 24 * 60 * 60, path: '/' });
  },

  setName: (name) => {
    set({ name });
    localStorage.setItem('user_name', name);
  },

  setProfilePicture: (profilePicture) => {
    set({ profilePicture });
    localStorage.setItem('profile_picture', profilePicture);
  },

  setUser: (user) => {
    set({
      token: user.token,
      name: user.name,
      profilePicture: user.profilePicture,
    });
    setCookie('access_token', user.token, { maxAge: 7 * 24 * 60 * 60, path: '/' });
    localStorage.setItem('user_name', user.name);
    localStorage.setItem('profile_picture', user.profilePicture);
  },

  loadUserFromStorage: () => {
    const token = getCookie('access_token')?.toString() || '';
    const name = localStorage.getItem('user_name') || '';
    const profilePicture = localStorage.getItem('profile_picture') || '';

    set({ token, name, profilePicture });
  },
}));
