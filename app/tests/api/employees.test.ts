import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/employees/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    employee: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('GET /api/employees', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns employees with pagination', async () => {
    const mockEmployees = [
      { id: 1, employeeId: 'EMP00001', name: 'John Doe', title: 'Engineer', department: 'Engineering', country: 'USA', baseSalary: 100000, bonus: 10000, currency: 'USD' },
    ];

    (prisma.employee.findMany as any).mockResolvedValue(mockEmployees);
    (prisma.employee.count as any).mockResolvedValue(1);

    const request = new Request('http://localhost:3000/api/employees?page=1&limit=20');
    const response = await GET(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.employees).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
  });

  it('returns 400 for invalid query params', async () => {
    const request = new Request('http://localhost:3000/api/employees?page=0');
    const response = await GET(request as any);

    expect(response.status).toBe(400);
  });
});