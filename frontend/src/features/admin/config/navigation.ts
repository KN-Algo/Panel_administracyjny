import {
  Calendar,
  FolderKanban,
  LayoutDashboard,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { matchPath } from "react-router-dom";
import { ADMIN_PATHS } from "./paths";

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
  // true = pozycja aktywna także dla podstron (np. Posty dla /posts/new)
  matchNested?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// sidebar i breadcrumbs budują się z tej konfiguracji - zmiana menu = zmiana tylko tutaj
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Główne",
    items: [
      { title: "Dashboard", to: ADMIN_PATHS.dashboard, icon: LayoutDashboard },
    ],
  },
  {
    label: "Treść strony",
    items: [
      {
        title: "Posty",
        to: ADMIN_PATHS.posts,
        icon: Calendar,
        matchNested: true,
      },
      { title: "Projekty", to: ADMIN_PATHS.projects, icon: FolderKanban },
      { title: "Zespół", to: ADMIN_PATHS.team, icon: Users },
    ],
  },
  {
    label: "Personalizacja",
    items: [
      { title: "Modale członków", to: ADMIN_PATHS.memberModals, icon: UserCog },
    ],
  },
];

export const isNavItemActive = (item: NavItem, pathname: string) =>
  matchPath({ path: item.to, end: !item.matchNested }, pathname) !== null;

export interface Crumb {
  title: string;
  to?: string;
}

// podstrony, których nie ma w menu, ale mają własny okruszek
const SUB_PAGES: { pattern: string; parent: string; crumb: Crumb }[] = [
  {
    pattern: `${ADMIN_PATHS.posts}/new`,
    parent: ADMIN_PATHS.posts,
    crumb: { title: "Dodaj post" },
  },
  {
    pattern: `${ADMIN_PATHS.posts}/:id/edit`,
    parent: ADMIN_PATHS.posts,
    crumb: { title: "Edycja posta" },
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

export function getBreadcrumbs(pathname: string): Crumb[] {
  const root: Crumb = { title: "Panel", to: ADMIN_PATHS.dashboard };

  const sub = SUB_PAGES.find((page) => matchPath(page.pattern, pathname));
  if (sub) {
    const parent = ALL_ITEMS.find((item) => item.to === sub.parent);
    return [
      root,
      ...(parent ? [{ title: parent.title, to: parent.to }] : []),
      sub.crumb,
    ];
  }

  const item = ALL_ITEMS.find((navItem) => matchPath(navItem.to, pathname));
  if (!item || item.to === ADMIN_PATHS.dashboard)
    return [{ title: "Dashboard" }];
  return [root, { title: item.title }];
}
