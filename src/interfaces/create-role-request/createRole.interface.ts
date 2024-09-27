import { IRolePermission } from "../user.interface";

export interface IRoleRequest {
	roleName: string;
	permissions: IRolePermission[];
	roleLevel: string;
}
