import { create } from 'zustand';

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
}

export const useStore = create<StoreState>((set) => ({
  token: '',
  name: '',
  profilePicture: '',
  
  setToken: (token) => set({ token }),
  setName: (name) => set({ name }),
  setProfilePicture: (profilePicture) => set({ profilePicture }),
  
  setUser: (user) => set({
    token: user.token,
    name: user.name,
    profilePicture: user.profilePicture,
  }),
}));
