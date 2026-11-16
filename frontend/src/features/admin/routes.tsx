import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ADMIN_PATHS } from "./config/paths";
import { AdminLayout } from "./layout/AdminLayout";

// strony admina ładowane leniwie - nie trafiają do bundla strony publicznej
const DashboardPage = lazy(() =>
  import("./modules/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const PostsListPage = lazy(() =>
  import("./modules/posts/pages/PostsListPage").then((m) => ({
    default: m.PostsListPage,
  })),
);
const PostCreatePage = lazy(() =>
  import("./modules/posts/pages/PostCreatePage").then((m) => ({
    default: m.PostCreatePage,
  })),
);
const PostEditPage = lazy(() =>
  import("./modules/posts/pages/PostEditPage").then((m) => ({
    default: m.PostEditPage,
  })),
);
const ProjectsPage = lazy(() =>
  import("./modules/projects/ProjectsPage").then((m) => ({
    default: m.ProjectsPage,
  })),
);
const TeamPage = lazy(() =>
  import("./modules/team/TeamPage").then((m) => ({ default: m.TeamPage })),
);
const MemberModalsPage = lazy(() =>
  import("./modules/member-modals/MemberModalsPage").then((m) => ({
    default: m.MemberModalsPage,
  })),
);

// wywoływane wewnątrz <Routes> w src/routes/index.tsx
export function renderAdminRoutes() {
  return (
    <>
      <Route path={ADMIN_PATHS.login} element={<LoginPage />} />
      <Route
        path={ADMIN_PATHS.dashboard}
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="posts" element={<PostsListPage />} />
        <Route path="posts/new" element={<PostCreatePage />} />
        <Route path="posts/:id/edit" element={<PostEditPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="member-modals" element={<MemberModalsPage />} />

        {/* stare adresy - przekierowania, żeby nie psuć zapisanych linków */}
        <Route
          path="add-post"
          element={<Navigate to={ADMIN_PATHS.postNew} replace />}
        />
        <Route
          path="edit-post"
          element={<Navigate to={ADMIN_PATHS.posts} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={ADMIN_PATHS.dashboard} replace />}
        />
      </Route>
    </>
  );
}
