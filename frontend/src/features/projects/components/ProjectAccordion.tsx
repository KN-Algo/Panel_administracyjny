import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!isExpanded) return;

    const timeout = window.setTimeout(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [isExpanded]);

  return (
    <div ref={rootRef} className="mb-4">
      <Button
        type="button"
        onClick={onToggle}
        appearance="disclosure"
        size="inline"
        aria-expanded={isExpanded}
      >
        <span className="text-lg font-semibold">{project.title}</span>
        <ChevronDown
          className={`w-6 h-6 transition-transform duration-500 ease-out ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </Button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] mt-4 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ${
              isExpanded ? "translate-y-0" : "-translate-y-4"
            }`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(project.description),
              }}
              className="text-gray-700 leading-relaxed mb-6"
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
