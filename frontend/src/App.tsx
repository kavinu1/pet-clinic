import { Route, Routes } from 'react-router-dom';

import RequireAuth from './routes/RequireAuth';
import RequireRole from './routes/RequireRole';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardRedirect from './pages/DashboardRedirect';
import ClientDashboard from './pages/ClientDashboard';
import StaffDashboard from './pages/StaffDashboard';
import PetFormPage from './pages/PetFormPage';
import PetDetailsPage from './pages/PetDetailsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/pets/:id" element={<PetDetailsPage />} />

        <Route element={<RequireRole role="client" />}>
          <Route path="/client" element={<ClientDashboard />} />
        </Route>

        <Route element={<RequireRole role="staff" />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/pets/new" element={<PetFormPage />} />
          <Route path="/staff/pets/:id/edit" element={<PetFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
