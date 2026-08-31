import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

import teamData from "@/data/team.json";
import teamDetailsData from "@/data/teamDetails.json";
import {
  ContentContainer,
  FeaturePageHeader,
  Heading,
  PublicPage,
  Section,
  Text,
} from "@/shared";
import type { TeamMember, TeamMemberDetails } from "@/types";

import MemberGrid from "./components/MemberGrid";
import SupervisorCard, {
  type SupervisorCardProps,
} from "./components/SupervisorCard";

export default function TeamPage() {
  const { t } = useTranslation();
  const members = teamData as TeamMember[];
  const memberDetails = teamDetailsData as TeamMemberDetails[];
  const supervisors: SupervisorCardProps[] = [
    {
      name: "mgr inż. Marta Lampasiak",
      image: "/img/leaders/martalampasiak.webp",
      imageAlt: "Marta Lampasiak",
      biography: t("team.marta_bio"),
    },
    {
      name: "dr inż. Jacek Jagodziński",
      image: "/img/leaders/jacekjagodzinski.webp",
      imageAlt: "Jacek Jagodziński",
      biography: t("team.jacek_bio"),
    },
  ];

  return (
    <PublicPage>
      <FeaturePageHeader
        title={t("team.page_title")}
        subtitle={t("team.page_subtitle")}
        icon={<Users className="h-5 w-5" aria-hidden="true" />}
      />

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

      <Section tone="subtle">
        <ContentContainer>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {supervisors.map((supervisor) => (
                <SupervisorCard key={supervisor.name} {...supervisor} />
              ))}
            </div>
          </div>
        </ContentContainer>
      </Section>

      <MemberGrid
        title={t("team.members_title")}
        members={members}
        memberDetails={memberDetails}
      />
    </PublicPage>
  );
}
