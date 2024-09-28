export interface IStockItem {
	id: string;
	productName: string;
	quantity: number;
	unitOfMeasurement: string;
	productValue: number;
	supplierId: string;
	supplier?: ISupplier;
	totalMeasurement: number;
}

export interface ISupplier {
	id: string;
	supplierName: string;
	email: string;
	phone: string;
}
