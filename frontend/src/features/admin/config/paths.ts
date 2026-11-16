// jedyne miejsce ze ścieżkami panelu - nie wpisujemy "/panel/admin/..." ręcznie w komponentach
const ADMIN_ROOT = "/panel/admin";

export const ADMIN_PATHS = {
  login: "/panel",
  dashboard: ADMIN_ROOT,
  posts: `${ADMIN_ROOT}/posts`,
  postNew: `${ADMIN_ROOT}/posts/new`,
  postEdit: (id: string) =>
    `${ADMIN_ROOT}/posts/${encodeURIComponent(id)}/edit`,
  projects: `${ADMIN_ROOT}/projects`,
  team: `${ADMIN_ROOT}/team`,
  memberModals: `${ADMIN_ROOT}/member-modals`,
} as const;

// publiczna strona, na której można podejrzeć post
export const publicPostUrl = (id: string) =>
  `/events#${encodeURIComponent(id)}`;
