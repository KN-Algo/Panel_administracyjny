import { useState, type ReactNode } from "react";

import { ContentContainer, Heading, Section } from "@/shared";
import type { Project } from "@/types";
import ProjectAccordion from "./ProjectAccordion";

interface ProjectSectionProps {
  projects: Project[];
  title?: ReactNode;
}

export default function ProjectSection({
  projects,
  title,
}: ProjectSectionProps) {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const toggleProject = (index: number) => {
    setExpandedProject((currentIndex) =>
      currentIndex === index ? null : index,
    );
  };

  return (
    <Section>
      <ContentContainer size="content">
        {title ? (
          <Heading level={2} size="section" align="center" spacingBottom="xl">
            {title}
          </Heading>
        ) : null}
        {projects.map((project, index) => (
          <ProjectAccordion
            key={index}
            project={project}
            isExpanded={expandedProject === index}
            onToggle={() => toggleProject(index)}
          />
        ))}
      </ContentContainer>
    </Section>
  );
}
