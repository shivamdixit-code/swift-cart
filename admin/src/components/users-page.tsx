"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: string;
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    void api.get<User[]>("/users").then((response) => setUsers(response.data));
  }, []);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <span className="text-sm text-slate-500">{users.length} users</span>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="py-4 font-medium">{user.name}</td>
                <td className="py-4">{user.phone}</td>
                <td className="py-4 capitalize">{user.role}</td>
                <td className="py-4 capitalize">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
