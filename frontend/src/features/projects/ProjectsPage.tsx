import { useTranslation } from "react-i18next";
import { FolderKanban } from "lucide-react";

import mipProjectsDataDe from "@/data/mip_projects_de.json";
import mipProjectsDataEn from "@/data/mip_projects_en.json";
import mipProjectsDataPl from "@/data/mip_projects_pl.json";
import projectsDataDe from "@/data/projects_de.json";
import projectsDataEn from "@/data/projects_en.json";
import projectsDataPl from "@/data/projects_pl.json";
import {
  ContentContainer,
  FeaturePageHeader,
  PublicPage,
} from "@/shared";
import type { Project } from "@/types";

import ProjectSection from "./components/ProjectSection";

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [projects, upcomingProjects] =
    i18n.language === "en"
      ? [projectsDataEn, mipProjectsDataEn]
      : i18n.language === "de"
        ? [projectsDataDe, mipProjectsDataDe]
        : [projectsDataPl, mipProjectsDataPl];

  return (
    <PublicPage tone="muted" minHeight="screen">
      <FeaturePageHeader
        title={t("projects.page_title")}
        subtitle={t("projects.page_subtitle")}
        icon={<FolderKanban className="h-5 w-5" aria-hidden="true" />}
      />
      <ProjectSection projects={projects as Project[]} />
      <ContentContainer size="content">
        <hr className="border-gray-300 my-8" />
      </ContentContainer>
      <ProjectSection
        title={t("projects.upcoming_title")}
        projects={upcomingProjects as Project[]}
      />
    </PublicPage>
  );
}
