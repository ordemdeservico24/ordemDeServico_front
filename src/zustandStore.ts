import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export interface Role {
	id: string;
	operations: string[];
	resource: string;
	roleId: string;
}

interface User {
	name: string;
	userId?: string;
	teamId?: string;
	profilePicture: string;
	token: string;
	role: Role[];
}

interface StoreState {
	token: string;
	name: string;
	userId?: string;
	teamId?: string;
	profilePicture: string;
	role: Role[];
	setToken: (token: string) => void;
	setName: (name: string) => void;
	setUserId: (userId: string) => void;
	setTeamId: (teamId: string) => void;
	setProfilePicture: (profilePicture: string) => void;
	setRole: (role: Role[]) => void;
	setUser: (user: User) => void;
	loadUserFromStorage: () => void;
	logout: () => void;
}

export const useStore = create<StoreState>()(
	persist(
		(set) => ({
			token: "",
			name: "",
			userId: "",
			teamId: "",
			profilePicture: "",
			role: [],

			setToken: (token) => {
				set({ token });
				setCookie("access_token", token, { maxAge: 7 * 24 * 60 * 60, path: "/" });
			},

			setName: (name) => {
				set({ name });
				localStorage.setItem("user_name", name);
			},

			setUserId: (userId) => {
				set({ userId });
				localStorage.setItem("userId", userId);
			},

			setTeamId: (teamId) => {
				set({ teamId });
				localStorage.setItem("teamId", teamId);
			},

			setProfilePicture: (profilePicture) => {
				set({ profilePicture });
				localStorage.setItem("profile_picture", profilePicture);
			},

			setRole: (role: Role[]) => {
				set({ role });
				localStorage.setItem("role", JSON.stringify(role));
			},

			setUser: (user) => {
				set({
					token: user.token,
					name: user.name,
					profilePicture: user.profilePicture,
					role: user.role,
				});
				setCookie("access_token", user.token, { maxAge: 7 * 24 * 60 * 60, path: "/" });
				localStorage.setItem("user_name", user.name);
				localStorage.setItem("profile_picture", user.profilePicture);
				localStorage.setItem("role", JSON.stringify(user.role));
			},

			loadUserFromStorage: () => {
				const token = getCookie("access_token")?.toString() || "";
				const name = localStorage.getItem("user_name") || "";
				const profilePicture = localStorage.getItem("profile_picture") || "";
				const role = localStorage.getItem("role");
				const parsedRole = role ? JSON.parse(role) : [];

				set({ token, name, profilePicture, role: parsedRole });
			},

			logout: () => {
				set({
					token: "",
					name: "",
					profilePicture: "",
					teamId: "",
					role: [],
				});
				deleteCookie("access_token", { path: "/" });
				localStorage.removeItem("user_name");
				localStorage.removeItem("profile_picture");
				localStorage.removeItem("teamId");
				localStorage.removeItem("role");
			},
		}),
		{
			name: "user-storage",
			getStorage: () => localStorage,
			partialize: (state) => ({
				name: state.name,
				userId: state.userId,
				teamId: state.teamId,
				profilePicture: state.profilePicture,
				role: state.role,
			}),
		}
	)
);
