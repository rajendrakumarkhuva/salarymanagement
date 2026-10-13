import { z } from 'zod';

export const employeeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  country: z.string().optional(),
  department: z.string().optional(),
  sortBy: z.enum(['name', 'baseSalary', 'effectiveDate']).default('effectiveDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type EmployeeQuery = z.infer<typeof employeeQuerySchema>;