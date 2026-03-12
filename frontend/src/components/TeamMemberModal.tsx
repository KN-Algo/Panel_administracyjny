import { X, Instagram, Linkedin, Github, Globe } from "lucide-react";
import type { TeamMember, TeamMemberDetails } from "@/types";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface TeamMemberModalProps {
  member: TeamMember;
  details: TeamMemberDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamMemberModal({
  member,
  details,
  isOpen,
  onClose,
}: TeamMemberModalProps) {
  // Zamknij modal przy naciśnięciu ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Jeśli nie ma szczegółów, nie wyświetlaj modala
  if (!details) return null;

  // Debug - sprawdź ścieżkę obrazu
  const imagePath = member.image.replace("../img/", "/img/");
  console.log("Image path:", imagePath, "Original:", member.image);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Przycisk zamknięcia */}
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md hover:bg-white hover:rotate-90 transition-all duration-300 shadow-lg"
          aria-label="Zamknij"
        >
          <X size={22} className="text-gray-700 hover:text-gray-900" />
        </Button>

        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Lewa strona - Zdjęcie */}
          <div className="md:w-2/5 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center p-10 relative overflow-hidden">
            {/* Dekoracyjne elementy tła */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#000424]/5 to-[#000530]/5"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#000424]/8 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#000530]/8 rounded-full blur-3xl"></div>

            <div className="w-full max-w-xs relative z-10">
              <div className="relative group">
                <img
                  src={imagePath}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full aspect-[3/4] object-cover rounded-3xl shadow-2xl ring-4 ring-[#000424]/20 transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(e) => {
                    console.error("Image failed to load:", imagePath);
                    e.currentTarget.src = "/img/members/temp.webp";
                  }}
                />
                {/* Gradient overlay na hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#000424]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Prawa strona - Treść */}
          <div className="md:w-3/5 overflow-y-auto p-10 bg-white">
            {/* Nagłówek */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                {member.firstName} {member.lastName}
              </h2>
              {member.position && (
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#000424] to-[#000530] text-white text-sm font-semibold shadow-md">
                  {member.position === "president"
                    ? "Prezes"
                    : member.position === "vice_president"
                      ? "Wiceprezes"
                      : member.position === "secretary"
                        ? "Sekretarz"
                        : member.position === "board_member"
                          ? "Członek Zarządu"
                          : member.position}
                </div>
              )}
            </div>

            {/* Bio */}
            {details.bio && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#000424] rounded-full"></span>O
                  mnie
                </h3>
                <p className="text-gray-600 leading-relaxed text-base pl-3">
                  {details.bio}
                </p>
              </div>
            )}

            {/* Zainteresowania */}
            {details.interests && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#000424] rounded-full"></span>
                  Zainteresowania
                </h3>
                <p className="text-gray-600 leading-relaxed text-base pl-3">
                  {details.interests}
                </p>
              </div>
            )}

            {/* Social Media */}
            {details.socialMedia &&
              Object.keys(details.socialMedia).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#000424] rounded-full"></span>
                    Social Media
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
                        className="group flex items-center justify-center w-9 h-9 bg-[#0077B5] text-white rounded-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110"
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
                        className="group flex items-center justify-center w-9 h-9 bg-gradient-to-r from-[#000424] to-[#000638] text-white rounded-md hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300 hover:scale-110"
                        aria-label="Strona osobista"
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
