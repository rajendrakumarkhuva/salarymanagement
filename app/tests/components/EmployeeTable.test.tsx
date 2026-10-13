
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeTable } from '@/app/components/EmployeeTable';
import { Employee } from '@/app/types/employee';

const mockEmployees: Employee[] = [
  {
    id: 1,
    employeeId: 'EMP00001',
    name: 'John Doe',
    title: 'Software Engineer',
    department: 'Engineering',
    country: 'USA',
    baseSalary: 120000,
    bonus: 15000,
    currency: 'USD',
  },
];

describe('EmployeeTable', () => {
  it('renders employee data correctly', () => {
    render(<EmployeeTable employees={mockEmployees} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('USD 120,000')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<EmployeeTable employees={mockEmployees} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('shows empty state when no employees', () => {
    render(<EmployeeTable employees={[]} />);
    expect(screen.getByText(/no employees/i)).toBeInTheDocument();
  });
});