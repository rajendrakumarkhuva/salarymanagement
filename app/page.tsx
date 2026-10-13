"use client";

import { useState, useEffect } from "react";
import { EmployeeTable } from "@/app/components/EmployeeTable";
import { EditSalaryModal } from "@/app/components/EditSalaryModal";
import { Button } from "@/app/components/ui/Button";
import { Employee } from "./types/employee";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";

interface ApiResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SalaryManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "20",
      ...(search && { search }),
      ...(country && { country }),
      ...(department && { department }),
    });

    try {
      const res = await fetch(`/api/employees?${params}`);
      const data: ApiResponse = await res.json();
      setEmployees(data.employees);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(1);
  }, [search, country, department]);

  const handlePageChange = (newPage: number) => {
    fetchEmployees(newPage);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleSave = (updatedEmployee: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp,
      ),
    );
    setSelectedEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Employee Salary Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and analyze salary data for 10,000 employees
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <input
            type="text"
            placeholder="Search by name, title, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[280px] border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-48 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-48 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setCountry("");
              setDepartment("");
            }}
            className="border-gray-,300 text-gray-700 hover:bg-gray-100"
          >
            Clear Filters
          </Button>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading employees...</div>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <p className="text-gray-500">
              No employees found matching your filters.
            </p>
          </div>
        ) : (
          <>
            <EmployeeTable employees={employees} onEdit={handleEdit} />

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1}–{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </Button>
                <span className="px-4 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
        <AnalyticsDashboard />
      </div>

      {/* Edit Modal */}
      <EditSalaryModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onSave={handleSave}
      />
    </div>
  );
}
