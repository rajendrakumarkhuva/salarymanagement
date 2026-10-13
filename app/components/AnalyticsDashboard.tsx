'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  byCountry: Array<{ country: string; _avg: { baseSalary: number | null }; _count: { id: number } }>;
  byDepartment: Array<{ department: string; _avg: { baseSalary: number | null }; _count: { id: number } }>;
  totalPayroll: number;
  totalEmployees: number;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading analytics...</div>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Summary Cards */}
      <div className="bg-white p-6 rounded-2xl border">
        <div className="text-sm text-gray-500">Total Employees</div>
        <div className="text-3xl font-semibold mt-1">{data.totalEmployees.toLocaleString()}</div>
      </div>
      <div className="bg-white p-6 rounded-2xl border">
        <div className="text-sm text-gray-500">Total Payroll</div>
        <div className="text-3xl font-semibold mt-1">USD {data.totalPayroll.toLocaleString()}</div>
      </div>

      {/* Top Countries by Average Salary */}
      <div className="bg-white p-6 rounded-2xl border md:col-span-1">
        <div className="text-sm font-medium mb-4 text-gray-700">Average Salary by Country</div>
        <div className="space-y-2 text-sm">
          {data.byCountry.slice(0, 5).map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.country}</span>
              <span className="font-medium">USD {Math.round(item._avg.baseSalary || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Departments */}
      <div className="bg-white p-6 rounded-2xl border md:col-span-2">
        <div className="text-sm font-medium mb-4 text-gray-700">Average Salary by Department</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {data.byDepartment.slice(0, 8).map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.department}</span>
              <span className="font-medium">USD {Math.round(item._avg.baseSalary || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}