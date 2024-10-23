import { IOrderGet } from "./order.interface";
import { ISubject } from "./subject.interface";
import { ITeam } from "./team.interfaces";
import { IRole, IUser } from "./user.interface";
export interface ICompany {
	id: string;
	name: string;
	cnpj: string;
	address?: string;
	city?: string;
	federationUnit?: string;
	postalCode?: string;
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
	company: ICompany;
	secondaries?: ISecondaryGroup[];
}

export interface ISecondaryGroup {
	id?: string;
	cityName: string;
	primaryGroupId?: string;
	tertiaries?: ITertiaryGroup[];
	primary: IPrimaryGroup;
	company: ICompany;
}

export interface ITertiaryGroup {
	id?: string;
	districtName: string;
	secondaryGroupId?: string;
	secondary: ISecondaryGroup;
	users?: IUser[];
	orders: IOrderGet[];
	subjects: ISubject[];
}

export interface ITertiaryInfoPage {
	totalEmployees: number;
	totalUsers: number;
	newUsers30Days: number;
	last30DaysOrders: number;
	last7DaysOrders: number;
	last24HoursOrders: number;
	nameDistrict: string;
	secondaryInfo: ISecondaryGroup;
	id: string;
}
