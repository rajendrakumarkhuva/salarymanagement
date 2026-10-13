import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateEmployeeSchema = z.object({
  baseSalary: z.number().min(0),
  bonus: z.number().min(0).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const data = updateEmployeeSchema.parse(body);

    const updated = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        baseSalary: data.baseSalary,
        bonus: data.bonus ?? undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}