import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, CalendarX, Clock, Users, UserCircle, LogOut, ClipboardList } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path) && pathname !== '/dashboard-doctor';
  };

  const menuItems = [
    { path: '/dashboard-doctor', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/dashboard-doctor/schedule', label: 'Schedule', icon: Calendar },
    { path: '/dashboard-doctor/exceptions', label: 'Exceptions', icon: CalendarX },
    { path: '/dashboard-doctor/available', label: 'Available Slots', icon: Clock },
    { path: '/dashboard-doctor/patients', label: 'Patients', icon: Users },
    { path: '/dashboard-doctor/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Control Panel</h2>
            <p className="text-xs text-gray-500">Doctor Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/dashboard-doctor/logout"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all group"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
}