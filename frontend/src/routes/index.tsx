import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../features/home/HomePage';
import TeamPage from '../features/team/TeamPage';
import ProjectsPage from '../features/projects/ProjectsPage';
import EventsPage from '../features/events/EventsPage';
import ContactPage from '../features/contact/ContactPage';
import LoginPage from '../features/admin/LoginPage';
import AdminPage from '../features/admin/AdminPage';
import ProtectedRoute from '../features/admin/ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="panel" element={<LoginPage />} />
      <Route
        path="panel/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}
