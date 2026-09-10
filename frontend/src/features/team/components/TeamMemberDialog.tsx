import { X, Instagram, Linkedin, Github, Globe } from "lucide-react";
import type { TeamMember, TeamMemberDetails } from "@/types";
import { useEffect, useId, useRef } from "react";
import { useTranslation } from "react-i18next";

interface TeamMemberDialogProps {
  member: TeamMember;
  details: TeamMemberDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamMemberDialog({
  member,
  details,
  isOpen,
  onClose,
}: TeamMemberDialogProps) {
  const { t } = useTranslation();
  const dialogTitleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Zamknij modal przy naciśnięciu ESC
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    closeButtonRef.current?.focus();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements =
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

      if (!focusableElements || focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Jeśli nie ma szczegółów, nie wyświetlaj modala
  if (!details) return null;

  const imagePath = member.image.replace("../img/", "/img/");

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-200 ${
        isOpen
          ? "pointer-events-auto animate-in fade-in opacity-100"
          : "pointer-events-none animate-out fade-out opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        className={`relative bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[88vh] sm:max-h-[90vh] overflow-y-auto md:overflow-hidden transition-all ${
          isOpen
            ? "animate-in zoom-in-95 duration-300"
            : "animate-out zoom-out-95 duration-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Przycisk zamknięcia */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          type="button"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark/90 text-white shadow-lg ring-1 ring-white/45 backdrop-blur-sm transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 md:right-5 md:top-5 md:h-11 md:w-11"
          aria-label={t("common.close")}
        >
          <X size={18} className="stroke-[2.75] md:h-5 md:w-5" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Lewa strona - Zdjęcie */}
          <div className="md:w-2/5 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
            {/* Dekoracyjne elementy tła */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/5 to-brand-deep/5"></div>
            <div className="hidden md:block absolute -top-20 -right-20 w-40 h-40 bg-brand-dark/8 rounded-full blur-3xl"></div>
            <div className="hidden md:block absolute -bottom-20 -left-20 w-40 h-40 bg-brand-deep/8 rounded-full blur-3xl"></div>

            <div className="w-full max-w-[170px] sm:max-w-[210px] md:max-w-xs relative z-10">
              <div className="relative group">
                <img
                  src={imagePath}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full aspect-[3/4] object-cover rounded-3xl shadow-2xl ring-4 ring-brand-dark/20 transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.src = "/img/members/temp.webp";
                  }}
                />
                {/* Gradient overlay na hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Prawa strona - Treść */}
          <div className="md:w-3/5 overflow-visible md:overflow-y-auto p-5 sm:p-6 md:p-10 bg-white">
            {/* Nagłówek */}
            <div className="mb-5 sm:mb-6 md:mb-8">
              <h2
                id={dialogTitleId}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight"
              >
                {member.firstName} {member.lastName}
              </h2>
              {member.position && (
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-dark to-brand-deep text-white text-sm font-semibold shadow-md">
                  {t(`team.${member.position}`, {
                    defaultValue: member.position,
                  })}
                </div>
              )}
            </div>

            {/* Bio */}
            {details.bio && (
              <div className="mb-5 sm:mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-dark rounded-full"></span>
                  {t("team.about_me")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base pl-3">
                  {details.bio}
                </p>
              </div>
            )}

            {/* Zainteresowania */}
            {details.interests && (
              <div className="mb-5 sm:mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-dark rounded-full"></span>
                  {t("team.interests")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base pl-3">
                  {details.interests}
                </p>
              </div>
            )}

            {/* Social Media */}
            {details.socialMedia &&
              Object.keys(details.socialMedia).length > 0 && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-dark rounded-full"></span>
                    {t("team.social_media")}
                  </h3>
                  <div className="flex gap-3 flex-wrap pl-3">
                    {details.socialMedia.instagram && (
                      <a
                        href={details.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-110"
                        aria-label="Instagram"
                      >
                        <Instagram
                          size={20}
                          className="group-hover:rotate-12 transition-transform duration-300"
                        />
                      </a>
                    )}
                    {details.socialMedia.linkedin && (
                      <a
                        href={details.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-9 h-9 bg-social-linkedin text-white rounded-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110"
                        aria-label="LinkedIn"
                      >
                        <Linkedin
                          size={20}
                          className="group-hover:rotate-12 transition-transform duration-300"
                        />
                      </a>
                    )}
                    {details.socialMedia.github && (
                      <a
                        href={details.socialMedia.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-9 h-9 bg-gray-800 text-white rounded-md hover:shadow-lg hover:shadow-gray-800/30 transition-all duration-300 hover:scale-110"
                        aria-label="GitHub"
                      >
                        <Github
                          size={20}
                          className="group-hover:rotate-12 transition-transform duration-300"
                        />
                      </a>
                    )}
                    {details.socialMedia.website && (
                      <a
                        href={details.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-9 h-9 bg-gradient-to-r from-brand-dark to-brand-deeper text-white rounded-md hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300 hover:scale-110"
                        aria-label={t("team.personal_website")}
                      >
                        <Globe
                          size={20}
                          className="group-hover:rotate-12 transition-transform duration-300"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
