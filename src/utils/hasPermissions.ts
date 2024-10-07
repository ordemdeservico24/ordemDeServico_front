import { Role, useStore } from "@/zustandStore";

export const hasPermission = (
	roles: Role[],
	resources: string | string[],
	operation: string | string[],
	requiredRoleLevel?: string | string[],
	userRoleLevel?: string
): boolean => {
	if (!Array.isArray(roles)) {
		console.error("Expected an array for roles, but got:", roles);
		return false;
	}

	if (!resources && !operation) return true;

	const matchingRoles = roles.filter((role) =>
		Array.isArray(resources) ? resources.some((resource) => role.resource === resource) : role.resource === resources
	);

	if (matchingRoles.length === 0) return false;

	if (requiredRoleLevel && userRoleLevel) {
		if (Array.isArray(requiredRoleLevel)) {
			if (!requiredRoleLevel.includes(userRoleLevel)) {
				console.warn(`O usuário não possui o nível de role necessário. Necessário: ${requiredRoleLevel}, Usuário: ${userRoleLevel}`);
				return false;
			}
		} else if (userRoleLevel !== requiredRoleLevel) {
			console.warn(`O usuário não possui o nível de role necessário. Necessário: ${requiredRoleLevel}, Usuário: ${userRoleLevel}`);
			return false;
		}
	}

	if (operation) {
		if (Array.isArray(operation)) {
			return matchingRoles.every((role) => operation.every((op) => role.operations.includes(op)));
		} else {
			return matchingRoles.every((role) => role.operations.includes(operation));
		}
	}

	return true;
};
