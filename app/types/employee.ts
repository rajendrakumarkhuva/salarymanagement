export interface Employee {
    id: number;
    employeeId: string;
    name: string;
    title: string;
    department: string;
    country: string;
    baseSalary: number;
    bonus: number;
    currency: string;
    effectiveDate?: string | Date;
  }