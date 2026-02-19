import { useTranslation } from 'react-i18next';
import { useState, useRef, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import projectsDataPl from '@/data/projects_pl.json';
import projectsDataEn from '@/data/projects_en.json';
import projectsDataDe from '@/data/projects_de.json';
import mipProjectsDataPl from '@/data/mip_projects_pl.json';
import mipProjectsDataEn from '@/data/mip_projects_en.json';
import mipProjectsDataDe from '@/data/mip_projects_de.json';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [expandedMipProject, setExpandedMipProject] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState<{ [key: string]: number }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalSlide, setModalSlide] = useState(0);

  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const projects = useMemo(() => {
    const lang = i18n.language;
    if (lang === 'en') return projectsDataEn as Project[];
    if (lang === 'de') return projectsDataDe as Project[];
    return projectsDataPl as Project[];
  }, [i18n.language]);

  const mipProjects = useMemo(() => {
    const lang = i18n.language;
    if (lang === 'en') return mipProjectsDataEn as Project[];
    if (lang === 'de') return mipProjectsDataDe as Project[];
    return mipProjectsDataPl as Project[];
  }, [i18n.language]);

  const toggleProject = (index: number) => {
    // Jeśli zamykamy projekt
    if (expandedProject === index) {
      setExpandedProject(null);
      return;
    }
    
    // Jeśli jest otwarty inny projekt, najpierw go zamknij
    if (expandedProject !== null && expandedProject !== index) {
      setExpandedProject(null);
      setTimeout(() => {
        // Po zamknięciu poprzedniego, otwórz nowy
        scrollAndExpandProject(index, 'current');
      }, 300);
    } else {
      // Nie ma otwartego projektu, od razu otwórz
      scrollAndExpandProject(index, 'current');
    }
  };

  const toggleMipProject = (index: number) => {
    // Jeśli zamykamy projekt
    if (expandedMipProject === index) {
      setExpandedMipProject(null);
      return;
    }
    
    // Jeśli jest otwarty inny projekt, najpierw go zamknij
    if (expandedMipProject !== null && expandedMipProject !== index) {
      setExpandedMipProject(null);
      setTimeout(() => {
        // Po zamknięciu poprzedniego, otwórz nowy
        scrollAndExpandProject(index, 'mip');
      }, 300);
    } else {
      // Nie ma otwartego projektu, od razu otwórz
      scrollAndExpandProject(index, 'mip');
    }
  };

  const scrollAndExpandProject = (index: number, type: 'current' | 'mip') => {
    // Przewiń najpierw
    const element = projectRefs.current[`${type}-${index}`];
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    
    // Poczekaj na przewinięcie i rozwiń
    setTimeout(() => {
      if (type === 'current') {
        setExpandedProject(index);
      } else {
        setExpandedMipProject(index);
      }
    }, 500);
  };

  const handleSlideChange = (projectKey: string, direction: 'next' | 'prev', maxSlides: number) => {
    setCurrentSlide(prev => {
      const current = prev[projectKey] || 0;
      if (direction === 'next') {
        return { ...prev, [projectKey]: (current + 1) % maxSlides };
      } else {
        return { ...prev, [projectKey]: current === 0 ? maxSlides - 1 : current - 1 };
      }
    });
  };

  const openModal = (images: string[], startIndex: number = 0) => {
    const processedImages = images.map(img => img.replace('../img/', '/img/'));
    setModalImages(processedImages);
    setModalSlide(startIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setModalSlide(0);
  };

  const handleModalSlideChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setModalSlide((modalSlide + 1) % modalImages.length);
    } else {
      setModalSlide(modalSlide === 0 ? modalImages.length - 1 : modalSlide - 1);
    }
  };

  const renderProjectCard = (
    project: Project,
    index: number,
    isExpanded: boolean,
    toggleFn: (index: number) => void,
    projectType: 'current' | 'mip'
  ) => {
    const projectKey = `${projectType}-${index}`;
    const currentProjectSlide = currentSlide[projectKey] || 0;
    const hasImages = project.images && project.images.length > 0;

    return (
      <div 
        key={index} 
        className="mb-4"
        ref={(el) => { projectRefs.current[projectKey] = el; }}
      >
        <button
          onClick={() => toggleFn(index)}
          className="w-full bg-[#000424] text-white px-6 py-4 rounded-lg flex items-center justify-between hover:bg-[#000424]/90 transition-colors"
        >
          <span className="text-lg font-semibold">{project.title}</span>
          <ChevronDown
            className={`w-6 h-6 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-1000 mt-4' : 'max-h-0'
          }`}
        >
          {isExpanded && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div
                dangerouslySetInnerHTML={{ __html: project.description }}
                className="text-gray-700 leading-relaxed mb-6"
              />

              {hasImages && (
                <div className="relative">
                  {project.images!.length === 1 ? (
                    // Single image - no carousel
                    <div className="flex justify-center">
                      <img
                        src={project.images![0].replace('../img/', '/img/')}
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
                          src={project.images![currentProjectSlide].replace('../img/', '/img/')}
                          alt={`${project.title} - ${currentProjectSlide + 1}`}
                          className="max-w-full max-h-full object-contain rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => openModal(project.images!, currentProjectSlide)}
                        />
                      </div>

                      {/* Navigation arrows */}
                      <button
                        onClick={() => handleSlideChange(projectKey, 'prev', project.images!.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#000424] rounded-full p-3 shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleSlideChange(projectKey, 'next', project.images!.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#000424] rounded-full p-3 shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Dots indicator */}
                      <div className="flex justify-center gap-2 mt-4">
                        {project.images!.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              setCurrentSlide(prev => ({ ...prev, [projectKey]: idx }))
                            }
                            className={`h-2 rounded-full transition-all ${
                              idx === currentProjectSlide
                                ? 'bg-[#000424] w-8'
                                : 'bg-gray-300 w-2 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* Header Section */}
      <section className="py-14 text-center bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t('projects.page_title')}
          </h1>
        </div>
      </section>

      {/* Current Projects Section */}
      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          {projects.map((project, index) =>
            renderProjectCard(
              project,
              index,
              expandedProject === index,
              toggleProject,
              'current'
            )
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 max-w-5xl">
        <hr className="border-gray-300 my-8" />
      </div>

      {/* Upcoming Projects Section */}
      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">
            {t('projects.upcoming_title')}
          </h2>
          {mipProjects.map((project, index) =>
            renderProjectCard(
              project,
              index,
              expandedMipProject === index,
              toggleMipProject,
              'mip'
            )
          )}
        </div>
      </section>

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

          {/* Image carousel */}
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src={modalImages[modalSlide]}
              alt={`Modal image ${modalSlide + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {modalImages.length > 1 && (
              <>
                {/* Left arrow */}
                <button
                  onClick={() => handleModalSlideChange('prev')}
                  className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Right arrow */}
                <button
                  onClick={() => handleModalSlideChange('next')}
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110"
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
    </div>
  );
}
