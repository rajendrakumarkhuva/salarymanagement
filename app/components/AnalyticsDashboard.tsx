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
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500 py-8">Loading analytics...</div>;
  }

  if (!data) return null;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Salary Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="text-sm text-gray-500">Total Employees</div>
          <div className="text-4xl font-semibold mt-2 text-gray-900">{data.totalEmployees.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="text-sm text-gray-500">Total Payroll</div>
          <div className="text-4xl font-semibold mt-2 text-gray-900">
            USD {data.totalPayroll.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="text-sm text-gray-500">Average Base Salary</div>
          <div className="text-4xl font-semibold mt-2 text-gray-900">
            USD {Math.round(data.byCountry.reduce((sum, c) => sum + (c._avg.baseSalary || 0), 0) / data.byCountry.length).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Country & Department Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Country */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Average Salary by Country</h3>
          <div className="space-y-3">
            {data.byCountry.slice(0, 8).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.country}</span>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    USD {Math.round(item._avg.baseSalary || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{item._count.id} employees</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Department */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Average Salary by Department</h3>
          <div className="space-y-3">
            {data.byDepartment.slice(0, 10).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.department}</span>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    USD {Math.round(item._avg.baseSalary || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{item._count.id} employees</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}