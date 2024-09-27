import { ITertiaryGroup } from "./company.interface";

export interface IUser {
	id: string;
	name: string;
	email: string;
	phone: string;
	tertiaryGroupId: string | null;
	tertiary: ITertiaryGroup;
	typeOfProfileId: string | null;
	role: IRole;
	isTeamLeader: boolean;
	isTeamMember: boolean;
	isEmployee: boolean;
	salary: number | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface ITypeOfProfile {
	id: string;
	typeOfProfile: string;
	users: IUser[];
}

export interface IRole {
	id: string;
	roleName: string;
	permissions: IRolePermission[];
	roleLevel: string;
	_count?: {
		users: number;
	};
	users?: IUser[];
	companyId: string | null;
}

export interface IRolePermission {
	operations: string[];
	resource: string;
	resourceLabel: string;
}
