import { IUser } from "./user.interface";

export interface IStockItem {
	id: string;
	productName: string;
	quantity: number;
	unitOfMeasurement: string;
	productValue: number;
	supplierId: string;
	supplier?: ISupplier;
	totalMeasurement: number;
	usedQuantity: number;
	usedMeasurement: number;
}

export interface ISupplier {
	id: string;
	supplierName: string;
	email: string;
	phone: string;
}

export interface IStockHistory {
	id: string;
	userId: string;
	itemId: string;
	productName: string;
	quantity: number;
	totalMeasurement: number;
	unitOfMeasurement: string;
	user: IUser;
	createdAt: string;
}
