import { IOrder } from "./order.interface";

export interface ISubject {
	id?: string;
	name: string;
	expirationDays: number;
	orders?: IOrder[];
}
