import { IOrderGet } from "./order.interface";
import { ISubject } from "./subject.interface";
import { ITeam } from "./team.interfaces";
import { IRole, IUser } from "./user.interface";
export interface ICompany {
	id: string;
	name: string;
	cnpj: string;
	companyName: string;
	companyPhoto: string | "";
	planId: string;
	Order: IOrderGet[]; 
	User: IUser[]; 
	roles: IRole[];
	Team: ITeam[]; 
	primaries: IPrimaryGroup[];
	secondaries: ISecondaryGroup[]; 
	tertiaries: ITertiaryGroup[]; 
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
	company: ICompany;
}

export interface ITertiaryGroup {
	id?: string;
	districtName: string;
	secondaryGroupId?: string;
	users?: IUser[];
	orders: IOrderGet[];
	subjects: ISubject[];
}
