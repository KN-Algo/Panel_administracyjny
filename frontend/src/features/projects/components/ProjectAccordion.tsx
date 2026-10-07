import { useRef } from "react";
import DOMPurify from "dompurify";
import { ChevronDown } from "lucide-react";

import { Button } from "@/shared";
import type { Project } from "@/types";
import ProjectImageCarousel from "./ProjectImageCarousel";

interface ProjectAccordionProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ProjectAccordion({
  project,
  isExpanded,
  onToggle,
}: ProjectAccordionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const images = project.images ?? [];

  return (
    <div ref={rootRef} className="mb-4">
      <Button
        type="button"
        onClick={onToggle}
        appearance="disclosure"
        size="inline"
        aria-expanded={isExpanded}
      >
        <span className="project-accordion__title text-lg font-semibold min-w-0 break-words hyphens-auto text-left">{project.title}</span>
        <ChevronDown
          className={`shrink-0 ml-2 w-6 h-6 transition-transform duration-500 ease-out ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </Button>

      <div
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === "grid-template-rows" &&
            isExpanded
          ) {
            rootRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }}
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] mt-4 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`project-accordion__card bg-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ${
              isExpanded ? "translate-y-0" : "-translate-y-4"
            }`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(project.description),
              }}
              className="text-gray-700 leading-relaxed mb-6 break-words hyphens-auto [&_*]:max-w-full [&_img]:h-auto"
            />

            {images.length > 0 && (
              <ProjectImageCarousel images={images} title={project.title} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
