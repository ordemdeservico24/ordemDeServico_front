export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    tertiaryGroupId: string | null;
    typeOfProfileId: string | null; 
    role: {
        roleName: string;
    };
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
    companyId: string | null;
  }
  
  export interface IRolePermission {
    operations: string[];
    resource: string;
  }
  