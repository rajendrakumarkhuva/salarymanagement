'use client';

import { useState, useEffect } from 'react';

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  title: string;
  department: string;
  country: string;
  baseSalary: number;
  bonus: number;
  currency: string;
}

interface ApiResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SalaryManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      ...(search && { search }),
      ...(country && { country }),
      ...(department && { department }),
    });

    const res = await fetch(`/api/employees?${params}`);
    const data: ApiResponse = await res.json();
    
    setEmployees(data.employees);
    setPagination(data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees(1);
  }, [search, country, department]);

  const handlePageChange = (newPage: number) => {
    fetchEmployees(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employee Salary Management</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, title, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-80"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Employee Table */}
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{emp.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{emp.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {emp.currency} {emp.baseSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {emp.currency} {emp.bonus.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} employees
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}