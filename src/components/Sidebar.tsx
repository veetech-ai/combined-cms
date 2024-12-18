import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Boxes,
  CreditCard,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  UserCircle
} from 'lucide-react';

type View = 'dashboard' | 'customers' | 'modules' | 'pos' | 'analytics' | 'stores';

interface SidebarProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as const },
  { icon: UserCircle, label: 'Customers', view: 'customers' as const },
  { icon: Store, label: 'Stores', view: 'stores' as const },
  { icon: Boxes, label: 'Modules', view: 'modules' as const },
  { icon: CreditCard, label: 'POS Integrations', view: 'pos' as const },
  { icon: BarChart2, label: 'Analytics', view: 'analytics' as const },
];

export default function Sidebar({ onNavigate, currentView }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`bg-gray-900 text-white h-screen transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } fixed left-0 top-0`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {!isCollapsed && (
          <span className="text-xl font-bold">Admin Panel</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg"
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentView === item.view ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}