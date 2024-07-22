export interface IOrder {
	id: string;
	openningDate: Date;
	expirationDate: Date;
	orderStatus: string;
	subject: string;
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
	orderStatus: string;
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
}
