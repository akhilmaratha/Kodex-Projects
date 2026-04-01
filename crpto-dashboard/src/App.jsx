import { Navigate, Route, Routes } from 'react-router-dom'

import DashboardLayout from './components/layout/dashboard-layout'
import AnalyticsPage from './pages/dashboards/analytics-page'
import CryptoPage from './pages/dashboards/crypto-page'
import EcommercePage from './pages/dashboards/ecommerce-page'
import FormsPage from './pages/components/forms-page'
import IconsPage from './pages/components/icons-page'
import TablesPage from './pages/components/tables-page'
import UiElementsPage from './pages/components/ui-elements-page'
import BlankPage from './pages/pages/blank-page'
import ChatPage from './pages/pages/chat-page'
import ClientsPage from './pages/pages/clients-page'
import OrdersPage from './pages/pages/orders-page'
import PricingPage from './pages/pages/pricing-page'
import ProjectsPage from './pages/pages/projects-page'
import SettingsPage from './pages/pages/settings-page'
import CalendarPage from './pages/plugins/calendar-page'
import ChartsPage from './pages/plugins/charts-page'
import DatatablesPage from './pages/plugins/datatables-page'

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboards/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboards/e-commerce" element={<EcommercePage />} />
        <Route path="/dashboards/crypto" element={<CryptoPage />} />

        <Route path="/pages/settings" element={<SettingsPage />} />
        <Route path="/pages/projects" element={<ProjectsPage />} />
        <Route path="/pages/clients" element={<ClientsPage />} />
        <Route path="/pages/orders" element={<OrdersPage />} />
        <Route path="/pages/pricing" element={<PricingPage />} />
        <Route path="/pages/chat" element={<ChatPage />} />
        <Route path="/pages/blank-page" element={<BlankPage />} />

        <Route path="/components/ui-elements" element={<UiElementsPage />} />
        <Route path="/components/icons" element={<IconsPage />} />
        <Route path="/components/forms" element={<FormsPage />} />
        <Route path="/components/tables" element={<TablesPage />} />

        <Route path="/plugins/charts" element={<ChartsPage />} />
        <Route path="/plugins/datatables" element={<DatatablesPage />} />
        <Route path="/plugins/calendar" element={<CalendarPage />} />

        <Route path="*" element={<Navigate to="/dashboards/crypto" replace />} />
      </Route>
    </Routes>
  )
}

export default App
