export interface ICreateUserRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    tertiaryGroupId?: string | null;
    typeOfProfileId?: string | null; 
    roleId?: string | null;
  }
  