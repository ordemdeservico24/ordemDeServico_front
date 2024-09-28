export interface IRequest {
	subjectId: string;
	orderStatusId: string;
	requesterName: string;
	requesterPhone: string;
	requesterStreet: string;
	requesterHouseNumber: number;
	requesterComplement: string;
	requesterZipcode: string;
	notes: string;
}

export interface ICreateOrderStatus {
	orderStatusName: string;
	open?: boolean;
	inProgress?: boolean;
	finish?: boolean;
	review?: boolean;
}
