import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import teamData from "@/data/team.json";
import teamDetailsData from "@/data/teamDetails.json";
import type { TeamMember, TeamMemberDetails } from "@/types";
import TeamMemberModal from "@/components/TeamMemberModal";
import {
  ContentContainer,
  Heading,
  IconFrame,
  PageHeader,
  PublicPage,
  Section,
  Surface,
  Text,
} from "@/shared";

export default function TeamPage() {
  const { t } = useTranslation();
  const [martaExpanded, setMartaExpanded] = useState(false);
  const [jacekExpanded, setJacekExpanded] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const members = teamData as TeamMember[];
  const teamDetails = teamDetailsData as TeamMemberDetails[];

  const getPositionLabel = (position?: string) => {
    if (!position) return null;
    return t(`team.${position}`);
  };

  const getMemberDetails = (memberId: number): TeamMemberDetails | null => {
    return teamDetails.find((detail) => detail.id === memberId) || null;
  };

  const handleMemberClick = (member: TeamMember) => {
    const details = getMemberDetails(member.id);
    if (details) {
      setSelectedMember(member);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMember(null);
  }, []);

  return (
    <PublicPage>
      <PageHeader
        title={t("team.page_title")}
        subtitle={t("team.page_subtitle")}
        tone="muted"
      />

      {/* Group Photo Section */}
      <Section>
        <ContentContainer align="center">
          <div className="max-w-3xl mx-auto">
            <img
              src="/img/kn_algo_grupowe1.webp"
              alt="Zdjęcie zespołu"
              className="w-full rounded-3xl shadow-xl transition-transform duration-300 hover:scale-105"
            />
          </div>
        </ContentContainer>
      </Section>

      {/* Supervisors Introduction Section */}
      <Section>
        <ContentContainer>
          <Heading level={2} size="section" align="center" spacingBottom="3xl">
            {t("team.supervisors_title")}
          </Heading>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img
                  src="/img/leaders/opiekunowie2.webp"
                  alt="Opiekunowie"
                  className="w-full rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="md:w-1/2 space-y-4 text-gray-700">
                <Text
                  dangerouslySetInnerHTML={{
                    __html: t("team.supervisors_intro"),
                  }}
                  leading="relaxed"
                />
                <Text leading="relaxed">
                  {t("team.supervisors_collaboration")}
                </Text>
              </div>
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Supervisors Cards Section */}
      <Section tone="subtle">
        <ContentContainer>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Marta Lampasiak */}
              <Surface
                tone="white"
                radius="2xl"
                shadow="lg"
                overflow="hidden"
                cursor="pointer"
                interaction="scale"
                onClick={() => setMartaExpanded(!martaExpanded)}
              >
                <div className="p-5 text-center">
                  <img
                    src="/img/leaders/martalampasiak.webp"
                    alt="Marta Lampasiak"
                    className="w-1/2 object-cover rounded-2xl mx-auto mb-4 border-[3px] border-black shadow-lg"
                  />
                  <h5 className="text-lg font-semibold mb-4 text-gray-900">
                    mgr inż. Marta Lampasiak
                  </h5>
                  <div className="flex items-center justify-center gap-2 text-brand-dark">
                    <ChevronDown
                      size={24}
                      className={`transition-transform duration-300 ${
                        martaExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      martaExpanded ? "max-h-[500px] mt-4" : "max-h-0"
                    }`}
                  >
                    <p
                      dangerouslySetInnerHTML={{ __html: t("team.marta_bio") }}
                      className="text-gray-700 text-sm leading-relaxed text-left"
                    />
                  </div>
                </div>
              </Surface>

              {/* Jacek Jagodziński */}
              <Surface
                tone="white"
                radius="2xl"
                shadow="lg"
                overflow="hidden"
                cursor="pointer"
                interaction="scale"
                onClick={() => setJacekExpanded(!jacekExpanded)}
              >
                <div className="p-5 text-center">
                  <img
                    src="/img/leaders/jacekjagodzinski.webp"
                    alt="Jacek Jagodziński"
                    className="w-1/2 object-cover rounded-2xl mx-auto mb-4 border-[3px] border-black shadow-lg"
                  />
                  <h5 className="text-lg font-semibold mb-3 text-gray-900">
                    dr inż. Jacek Jagodziński
                  </h5>
                  <div className="flex items-center justify-center gap-2 text-brand-dark">
                    <ChevronDown
                      size={24}
                      className={`transition-transform duration-300 ${
                        jacekExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      jacekExpanded ? "max-h-[500px] mt-4" : "max-h-0"
                    }`}
                  >
                    <p
                      dangerouslySetInnerHTML={{ __html: t("team.jacek_bio") }}
                      className="text-gray-700 text-sm leading-relaxed text-left"
                    />
                  </div>
                </div>
              </Surface>
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Members Section */}
      <Section tone="muted">
        <ContentContainer>
          <Heading level={2} size="section" align="center" spacingBottom="3xl">
            {t("team.members_title")}
          </Heading>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
              {members.map((member) => {
                const hasDetails = !!getMemberDetails(member.id);
                return (
                  <div key={member.id}>
                    {hasDetails ? (
                      <Surface
                        as="button"
                        type="button"
                        onClick={() => handleMemberClick(member)}
                        tone="brand"
                        radius="2xl"
                        shadow="lg"
                        overflow="hidden"
                        interaction="rise"
                        position="relative"
                        width="full"
                        cursor="pointer"
                        textAlign="left"
                        group
                        aria-label={`${member.firstName} ${member.lastName}`}
                      >
                        <IconFrame
                          size="sm"
                          tone="glass"
                          placement="cardCorner"
                          interaction="nudge"
                        >
                          <ArrowRight size={14} />
                        </IconFrame>
                        <div className="py-5 px-5 flex flex-col items-center">
                          <div className="mb-0">
                            <img
                              src={member.image.replace("../img/", "/img/")}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-[270px] h-[350px] object-cover rounded-2xl border-[3px] border-white transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <h3 className="text-white text-base font-normal text-center mb-1 mt-4">
                            {member.firstName} {member.lastName}
                          </h3>
                          {member.position && (
                            <p className="text-white text-sm font-bold">
                              {getPositionLabel(member.position)}
                            </p>
                          )}
                        </div>
                      </Surface>
                    ) : (
                      <Surface
                        tone="brand"
                        radius="2xl"
                        shadow="lg"
                        overflow="hidden"
                        interaction="rise"
                        position="relative"
                      >
                        <div className="py-5 px-5 flex flex-col items-center">
                          <div className="mb-0">
                            <img
                              src={member.image.replace("../img/", "/img/")}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-[270px] h-[350px] object-cover rounded-2xl border-[3px] border-white transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <h3 className="text-white text-base font-normal text-center mb-1 mt-4">
                            {member.firstName} {member.lastName}
                          </h3>
                          {member.position && (
                            <p className="text-white text-sm font-bold">
                              {getPositionLabel(member.position)}
                            </p>
                          )}
                        </div>
                      </Surface>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Modal */}
      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          details={getMemberDetails(selectedMember.id)}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </PublicPage>
  );
}
