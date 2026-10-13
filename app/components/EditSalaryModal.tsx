"use client";

import { useState } from "react";
import { Employee } from "../types/employee";
import { Button } from "./ui/Button";

interface EditSalaryModalProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (updated: Employee) => void;
}

export function EditSalaryModal({
  employee,
  onClose,
  onSave,
}: EditSalaryModalProps) {
  const [baseSalary, setBaseSalary] = useState(employee?.baseSalary || 0);
  const [bonus, setBonus] = useState(employee?.bonus || 0);
  const [loading, setLoading] = useState(false);

  if (!employee) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseSalary, bonus }),
      });

      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Edit Salary - {employee.name}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Base Salary
            </label>
            <input
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bonus
            </label>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
