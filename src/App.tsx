import { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useLocation,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardContent from './components/DashboardContent';
import CustomersView from './components/customers/CustomersView';
import ModulesView from './components/modules/ModulesView';
import PosIntegrationView from './components/pos/PosIntegrationView';
import AnalyticsView from './components/analytics/AnalyticsView';
import StoresView from './components/stores/StoresView';
import { Login } from './components/auth/login';

import { ROUTES } from './constants/route-names';

import { useAuthStore } from './stores/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { checkAuth, isAuthenticated } = useAuthStore();
	const location = useLocation();

	useEffect(() => {
		checkAuth();
	}, []);

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/*"
						element={
							<ProtectedRoute>
								<div>
									<Sidebar />
									<div className="ml-64">
										<Header />
										<div className="mt-16">
											<Routes>
												<Route
													path={ROUTES.DASHBOARD}
													element={
														<DashboardContent />
													}
												/>
												<Route
													path={ROUTES.CUSTOMERS}
													element={<CustomersView />}
												/>
												<Route
													path={ROUTES.MODULES}
													element={<ModulesView />}
												/>
												<Route
													path={ROUTES.POS}
													element={
														<PosIntegrationView />
													}
												/>
												<Route
													path={ROUTES.ANALYTICS}
													element={<AnalyticsView />}
												/>
												<Route
													path={ROUTES.STORES}
													element={<StoresView />}
												/>
												<Route
													path="*"
													element={
														<Navigate
															to={
																ROUTES.DASHBOARD
															}
															replace
														/>
													}
												/>
											</Routes>
										</div>
									</div>
								</div>
							</ProtectedRoute>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
