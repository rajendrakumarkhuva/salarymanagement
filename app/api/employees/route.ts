// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { employeeQuerySchema } from '@/lib/schema';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate and parse query parameters with Zod
    const query = employeeQuerySchema.parse(Object.fromEntries(searchParams));

    const { page, limit, search, country, department, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build dynamic where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { title: { contains: search } },
        { employeeId: { contains: search } },
      ];
    }
    if (country) where.country = country;
    if (department) where.department = department;

    // Dynamic orderBy
    const orderBy = { [sortBy]: sortOrder };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          employeeId: true,
          name: true,
          title: true,
          department: true,
          country: true,
          baseSalary: true,
          bonus: true,
          currency: true,
          effectiveDate: true,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error },
        { status: 400 }
      );
    }
    console.error('GET /api/employees error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}