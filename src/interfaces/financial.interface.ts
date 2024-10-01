import { IUser } from "./user.interface";

export interface IFinancialCategory {
	id: string;
	name: string;
	description?: string;
	amountSpent: number;
	isRecurrent: boolean;
}

export interface IFinancialReport {
	id: string;
	amount: number;
	startDate: Date;
	endDate: Date;
	generatedAt: Date;
	createdById: string;
	createdBy: string;
	financialCategories: Array<{ categoryId: string; category: IFinancialCategory }>;
}

export interface IFinancialCategoryItem {
	id: string;
	name: string;
	description?: string;
	amountSpent: number;
	financialCategoryId: string;
	isRecurrent: boolean;
	installmentValue?: number;
	dueDate?: Date;
}

export interface IRevenue {
	id: string;
	items: IRevenueItems[];
	totalRevenue: number;
	companyId: string;
	company: ICompany;
	createdAt: Date;
	updatedAt: Date;
}

export interface IRevenueItems {
	id: string;
	name: string;
	description?: string;
	quantity: number;
	value: number;
	revenueId: string;
	revenue: IRevenue;
	companyId: string;
	company: ICompany;
	createdAt: Date;
	updatedAt: Date;
}
interface ICompany {
	id: string;
	companyName: string;
	cnpj: string;
}

export interface FinancialCategory {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
	items: FinancialCategoryItem[];
	financialCategories: FinancialCategories[];
	companyId: string;
	company: ICompany;
}

export interface FinancialReport {
	id: string;
	amount: number;
	startDate: Date;
	endDate: Date;
	generatedAt: Date;
	createdById: string;
	createdBy: IUser;
	createdAt: Date;
	updatedAt: Date;
	financialCategories: FinancialCategories[];
	companyId: string;
	company: ICompany;
}

export interface FinancialCategories {
	id: string;
	amountSpent: number;
	financialReportId: string;
	financialReport: FinancialReport;
	categoryId: string;
	category: FinancialCategory;
	createdAt: Date;
	updatedAt: Date;
}

export interface FinancialCategoryItem {
	id: string;
	name: string;
	description?: string;
	amountSpent: number;
	itemPhoto?: string;
	financialCategoryId: string;
	financialCategory: FinancialCategory;
	companyId: string;
	company: ICompany;
	isRecurrent: boolean;
	installments?: number;
	dueDate?: Date;
	installmentValue?: number;
	createdAt: Date;
	updatedAt: Date;
	items: FinancialItem[];
}

export interface FinancialItem {
	id: string;
	name: string;
	description?: string;
	amountSpent: number;
	itemPhoto?: string | null;
	financialCategoryId: string;
	companyId: string;
	isRecurrent: boolean;
	installments?: number | null;
	dueDate?: string | null;
	installmentValue?: number;
	createdAt: string;
	updatedAt: string;
}
