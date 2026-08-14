import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../features/home/HomePage";
import TeamPage from "../features/team/TeamPage";
import ProjectsPage from "../features/projects/ProjectsPage";
import EventsPage from "../features/events/EventsPage";
import LoginPage from "../features/admin/LoginPage";
import ProtectedRoute from "../features/admin/ProtectedRoute";
import { AdminLayout } from "../features/admin/components/layout/AdminLayout";
import DashboardPage from "../features/admin/pages/DashboardPage";
import AdminProjectsPage from "../features/admin/pages/AdminProjectsPage";
import AdminEventsPage from "../features/admin/pages/AdminEventsPage";
import AdminTeamPage from "../features/admin/pages/AdminTeamPage";
import AdminPostsPage from "../features/admin/pages/AdminPostsPage";
import AdminAddPostPage from "../features/admin/pages/AdminAddPostPage";
import AdminMemberModalsPage from "../features/admin/pages/AdminMemberModalsPage";
import NotFoundPage from "../features/not-found/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="panel" element={<LoginPage />} />
      <Route
        path="panel/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="posts" element={<AdminPostsPage />} />
        <Route path="add-post" element={<AdminAddPostPage />} />
        <Route path="member-modals" element={<AdminMemberModalsPage />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="events" element={<EventsPage />} />
      </Route>
      <Route path="404" element={<Layout showNavbar={false} />}>
        <Route index element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
