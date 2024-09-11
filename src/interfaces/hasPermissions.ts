import { Role } from "@/zustandStore";

export const hasPermission = (
    roles: Role[],
    resource?: string,
    operation?: string
  ): boolean => {
    if (!Array.isArray(roles)) {
      console.error('Expected an array for roles, but got:', roles);
      return false;
    }
  
    if (!resource && !operation) return true;
    const matchingRole = roles.find(role => role.resource === resource);
    if (!matchingRole) return false;
    if (operation && !matchingRole.operations.includes(operation)) return false;
  
  return true;
  };