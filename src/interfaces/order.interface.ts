import { ISubject } from "./subject.interface";

export interface IOrder {
	id: string;
	openningDate: Date;
	expirationDate: Date;
	orderStatus: string;
	subjectId: string;
	subject: ISubject;
	notes: string;
	requesterName: string;
	requesterPhone: string;
	requesterStreet: string;
	requesterHouseNumber: number;
	requesterComplement: string;
	requesterZipcode: string;
}

export interface IOrderGet {
	id: string;
	orderId: number;
	openningDate: string;
	expirationDate: string;
	orderStatusId: string;
	orderStatus: IOrderStatus;
	subjectId: string;
	subject: {
		id: string;
		name: string;
		expirationDays: number;
	};
	notes: string;
	requesterName: string;
	requesterPhone: string;
	requesterStreet: string;
	requesterHouseNumber: number;
	requesterComplement: string;
	requesterZipcode: string;
	teamId: string;
	createdAt: string;
	updatedAt: string;
	assignedTeam: {
		id: string;
		teamLeaderId: string;
		teamName: string;
		createdAt: string;
		updatedAt: string;
	};
	isExpired: boolean;
}

export interface IOrderStatus {
	id: string;
	orderStatusName: string;
	open?: boolean;
	inProgress?: boolean;
	finish?: boolean;
	review?: boolean;
	orders?: IOrder[];
	tertiaryGroupId: string;
	companyId: string;
}
