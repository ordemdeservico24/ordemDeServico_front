import { Role } from "@/zustandStore";

export const hasPermission = (
  roles: Role[],
  resources?: string | string[],
  operation?: string | string[]
): boolean => {
  if (!Array.isArray(roles)) {
    console.error('Expected an array for roles, but got:', roles);
    return false;
  }

  if (!resources && !operation) return true;

  const matchingRoles = roles.filter(role =>
    Array.isArray(resources)
      ? resources.some(resource => role.resource === resource)
      : role.resource === resources
  );

  if (matchingRoles.length === 0) return false;

  if (operation) {
    if (Array.isArray(operation)) {
      return matchingRoles.every(role =>
        operation.every(op => role.operations.includes(op))
      );
    } else {
      return matchingRoles.every(role => role.operations.includes(operation));
    }
  }

  return true;
};
