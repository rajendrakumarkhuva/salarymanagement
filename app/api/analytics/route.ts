import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [byCountry, byDepartment, total] = await Promise.all([
      prisma.employee.groupBy({
        by: ['country'],
        _avg: { baseSalary: true },
        _count: { id: true },
      }),
      prisma.employee.groupBy({
        by: ['department'],
        _avg: { baseSalary: true },
        _count: { id: true },
      }),
      prisma.employee.aggregate({
        _sum: { baseSalary: true, bonus: true },
      }),
    ]);

    return NextResponse.json({
      byCountry,
      byDepartment,
      totalPayroll: (total._sum.baseSalary || 0) + (total._sum.bonus || 0),
      totalEmployees: await prisma.employee.count(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}