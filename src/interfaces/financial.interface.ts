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
  