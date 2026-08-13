import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { History, Search, Filter, ShieldAlert } from 'lucide-react';

interface Props {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<Props> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || log.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Security & Activity Audit Logs</h2>
          <p className="text-xs text-slate-500">Immutable history of evaluation triggers, mark overrides, and administrative actions</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
          <ShieldAlert className="w-4 h-4 text-emerald-500" />
          <span>Real-time Tracking Active</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, user name, or log details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs text-slate-900 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs font-bold text-slate-700 focus:outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="Admin">Admin Only</option>
          <option value="Faculty">Faculty Only</option>
          <option value="Student">Student Only</option>
        </select>
      </div>

      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/90 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Action Code</th>
              <th className="p-3.5">Details</th>
              <th className="p-3.5">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-slate-700 font-medium">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">{log.userName}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.userRole === 'Admin'
                        ? 'bg-purple-100 text-purple-800'
                        : log.userRole === 'Faculty'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {log.userRole}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-blue-600 font-bold">{log.action}</td>
                <td className="p-3.5 max-w-xs truncate">{log.details}</td>
                <td className="p-3.5 font-mono text-slate-400">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
