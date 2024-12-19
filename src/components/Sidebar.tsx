import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	LayoutDashboard,
	Store,
	Boxes,
	CreditCard,
	BarChart2,
	ChevronLeft,
	ChevronRight,
	UserCircle,
} from 'lucide-react';
import { ROUTES } from '../constants/route-names';

const navItems = [
	{ icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
	{ icon: UserCircle, label: 'Customers', path: ROUTES.CUSTOMERS },
	{ icon: Store, label: 'Stores', path: ROUTES.STORES },
	{ icon: Boxes, label: 'Modules', path: ROUTES.MODULES },
	{ icon: CreditCard, label: 'POS Integrations', path: ROUTES.POS },
	{ icon: BarChart2, label: 'Analytics', path: ROUTES.ANALYTICS },
];

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<aside
			className={`bg-gray-900 text-white h-screen transition-all duration-300 ${
				isCollapsed ? 'w-20' : 'w-64'
			} fixed left-0 top-0`}>
			<div className="p-4 flex justify-between items-center border-b border-gray-700">
				{!isCollapsed && (
					<span className="text-xl font-bold">Admin Panel</span>
				)}
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-2 hover:bg-gray-800 rounded-lg">
					{isCollapsed ? (
						<ChevronRight size={20} />
					) : (
						<ChevronLeft size={20} />
					)}
				</button>
			</div>

			<nav className="p-4">
				<ul className="space-y-2">
					{navItems.map(item => (
						<li key={item.label}>
							<button
								onClick={() => navigate(item.path)}
								className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
									location.pathname === item.path
										? 'bg-blue-600'
										: 'hover:bg-gray-800'
								}`}>
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
