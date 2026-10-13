"use client";

import { Employee } from "../types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
}

export function EmployeeTable({ employees, onEdit }: EmployeeTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Country
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Base Salary
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Bonus
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-mono text-gray-500">
                {emp.employeeId}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {emp.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{emp.title}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {emp.department}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{emp.country}</td>
              <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                {emp.currency} {emp.baseSalary.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-right text-gray-700">
                {emp.currency} {emp.bonus.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-center">
                {onEdit && (
                  <button
                    onClick={() => onEdit(emp)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
