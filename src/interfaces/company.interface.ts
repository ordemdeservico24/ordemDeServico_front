import { IUser } from "./user.interface";

export interface ICompany {
	id: string;
	cnpj: string;
	companyName: string;
	companyPhoto: string | "";
	planId: string;
}

export interface IPrimaryGroup {
	id?: string;
	stateName: string;
	companyId?: string;
	secondaries?: ISecondaryGroup[];
}

export interface ISecondaryGroup {
	id?: string;
	cityName: string;
	primaryGroupId?: string;
	tertiaries?: ITertiaryGroup[];
}

export interface ITertiaryGroup {
	id?: string;
	districtName: string;
	secondaryGroupId?: string;
	users?: IUser[];
}
