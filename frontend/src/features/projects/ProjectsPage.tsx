import { useTranslation } from "react-i18next";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import DOMPurify from "dompurify";
import projectsDataPl from "@/data/projects_pl.json";
import projectsDataEn from "@/data/projects_en.json";
import projectsDataDe from "@/data/projects_de.json";
import mipProjectsDataPl from "@/data/mip_projects_pl.json";
import mipProjectsDataEn from "@/data/mip_projects_en.json";
import mipProjectsDataDe from "@/data/mip_projects_de.json";
import type { Project } from "@/types";
import {
  Button,
  ContentContainer,
  Heading,
  PageHeader,
  PublicPage,
  Section,
} from "@/shared";

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [expandedMipProject, setExpandedMipProject] = useState<number | null>(
    null,
  );
  const [currentSlide, setCurrentSlide] = useState<{ [key: string]: number }>(
    {},
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalSlide, setModalSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);

  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const projects = useMemo(() => {
    const lang = i18n.language;
    if (lang === "en") return projectsDataEn as Project[];
    if (lang === "de") return projectsDataDe as Project[];
    return projectsDataPl as Project[];
  }, [i18n.language]);

  const mipProjects = useMemo(() => {
    const lang = i18n.language;
    if (lang === "en") return mipProjectsDataEn as Project[];
    if (lang === "de") return mipProjectsDataDe as Project[];
    return mipProjectsDataPl as Project[];
  }, [i18n.language]);

  const toggleProject = (index: number) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  const toggleMipProject = (index: number) => {
    setExpandedMipProject(expandedMipProject === index ? null : index);
  };

  // Gentle scroll to expanded project - only if not visible
  useEffect(() => {
    if (expandedProject !== null) {
      const element = projectRefs.current[`current-${expandedProject}`];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 200);
      }
    }
  }, [expandedProject]);

  useEffect(() => {
    if (expandedMipProject !== null) {
      const element = projectRefs.current[`mip-${expandedMipProject}`];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 200);
      }
    }
  }, [expandedMipProject]);

  const handleSlideChange = (
    projectKey: string,
    direction: "next" | "prev",
    maxSlides: number,
  ) => {
    setCurrentSlide((prev) => {
      const current = prev[projectKey] || 0;
      if (direction === "next") {
        return { ...prev, [projectKey]: (current + 1) % maxSlides };
      } else {
        return {
          ...prev,
          [projectKey]: current === 0 ? maxSlides - 1 : current - 1,
        };
      }
    });
  };

  const openModal = (images: string[], startIndex: number = 0) => {
    const processedImages = images.map((img) =>
      img.replace("../img/", "/img/"),
    );
    setModalImages(processedImages);
    setModalSlide(startIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setModalSlide(0);
    setIsImageTransitioning(false);
  };

  const handleModalSlideChange = useCallback(
    (direction: "next" | "prev") => {
      if (isImageTransitioning) return; // Prevent rapid clicking

      setSlideDirection(direction === "next" ? "right" : "left");
      setIsImageTransitioning(true);

      setTimeout(() => {
        setModalSlide((prev) => {
          const newSlide =
            direction === "next"
              ? (prev + 1) % modalImages.length
              : prev === 0
                ? modalImages.length - 1
                : prev - 1;
          return newSlide;
        });
        setIsImageTransitioning(false);
      }, 300);
    },
    [isImageTransitioning, modalImages.length],
  );

  // Keyboard navigation for modal
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        handleModalSlideChange("prev");
      } else if (e.key === "ArrowRight") {
        handleModalSlideChange("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, handleModalSlideChange]);

  const renderProjectCard = (
    project: Project,
    index: number,
    isExpanded: boolean,
    toggleFn: (index: number) => void,
    projectType: "current" | "mip",
  ) => {
    const projectKey = `${projectType}-${index}`;
    const currentProjectSlide = currentSlide[projectKey] || 0;
    const hasImages = project.images && project.images.length > 0;

    return (
      <div
        key={index}
        className="mb-4"
        ref={(el) => {
          projectRefs.current[projectKey] = el;
        }}
      >
        <Button
          onClick={() => toggleFn(index)}
          appearance="disclosure"
          size="inline"
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
              ref={(el) => {
                contentRefs.current[projectKey] = el;
              }}
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

              {hasImages && (
                <div className="relative">
                  {project.images!.length === 1 ? (
                    // Single image - no carousel
                    <div className="flex justify-center">
                      <img
                        src={project.images![0].replace("../img/", "/img/")}
                        alt={project.title}
                        className="max-w-full max-h-[600px] rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => openModal(project.images!, 0)}
                      />
                    </div>
                  ) : (
                    // Multiple images - carousel
                    <div className="relative">
                      <div className="flex justify-center items-center h-[500px] bg-gray-50 rounded-2xl">
                        <img
                          src={project.images![currentProjectSlide].replace(
                            "../img/",
                            "/img/",
                          )}
                          alt={`${project.title} - ${currentProjectSlide + 1}`}
                          className="max-w-full max-h-full object-contain rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() =>
                            openModal(project.images!, currentProjectSlide)
                          }
                        />
                      </div>

                      {/* Navigation arrows */}
                      <button
                        onClick={() =>
                          handleSlideChange(
                            projectKey,
                            "prev",
                            project.images!.length,
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark rounded-full p-3 shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() =>
                          handleSlideChange(
                            projectKey,
                            "next",
                            project.images!.length,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark rounded-full p-3 shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Dots indicator */}
                      <div className="flex justify-center gap-2 mt-4">
                        {project.images!.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              setCurrentSlide((prev) => ({
                                ...prev,
                                [projectKey]: idx,
                              }))
                            }
                            className={`h-2 rounded-full transition-all ${
                              idx === currentProjectSlide
                                ? "bg-brand-dark w-8"
                                : "bg-gray-300 w-2 hover:bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PublicPage tone="muted" minHeight="screen">
      <PageHeader title={t("projects.page_title")} />

      {/* Current Projects Section */}
      <Section>
        <ContentContainer size="content">
          {projects.map((project, index) =>
            renderProjectCard(
              project,
              index,
              expandedProject === index,
              toggleProject,
              "current",
            ),
          )}
        </ContentContainer>
      </Section>

      {/* Divider */}
      <ContentContainer size="content">
        <hr className="border-gray-300 my-8" />
      </ContentContainer>

      {/* Upcoming Projects Section */}
      <Section>
        <ContentContainer size="content">
          <Heading level={2} size="section" align="center" spacingBottom="xl">
            {t("projects.upcoming_title")}
          </Heading>
          {mipProjects.map((project, index) =>
            renderProjectCard(
              project,
              index,
              expandedMipProject === index,
              toggleMipProject,
              "mip",
            ),
          )}
        </ContentContainer>
      </Section>

      {/* Full Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image carousel with animation */}
          <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                key={modalSlide}
                src={modalImages[modalSlide]}
                alt={`Modal image ${modalSlide + 1}`}
                className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-500 ease-out ${
                  isImageTransitioning
                    ? slideDirection === "right"
                      ? "opacity-0 translate-x-20"
                      : "opacity-0 -translate-x-20"
                    : "opacity-100 translate-x-0"
                }`}
              />
            </div>

            {modalImages.length > 1 && (
              <>
                {/* Left arrow */}
                <button
                  onClick={() => handleModalSlideChange("prev")}
                  disabled={isImageTransitioning}
                  className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Right arrow */}
                <button
                  onClick={() => handleModalSlideChange("next")}
                  disabled={isImageTransitioning}
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                  {modalSlide + 1} / {modalImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PublicPage>
  );
}
