import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ContentContainer, Heading, Section } from "@/shared";
import type { TeamMember, TeamMemberDetails } from "@/types";
import MemberCard from "./MemberCard";
import TeamMemberDialog from "./TeamMemberDialog";

interface MemberGridProps {
  title: string;
  members: TeamMember[];
  memberDetails: TeamMemberDetails[];
}

export default function MemberGrid({
  title,
  members,
  memberDetails,
}: MemberGridProps) {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const getMemberDetails = (memberId: number) =>
    memberDetails.find((details) => details.id === memberId) ?? null;

  const openMember = (member: TeamMember) => {
    if (getMemberDetails(member.id)) setSelectedMember(member);
  };

  return (
    <Section tone="muted">
      <ContentContainer>
        <Heading level={2} size="section" align="center" spacingBottom="3xl">
          {title}
        </Heading>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
            {members.map((member) => (
              <div key={member.id}>
                <MemberCard
                  member={member}
                  positionLabel={
                    member.position ? t(`team.${member.position}`) : null
                  }
                  hasDetails={Boolean(getMemberDetails(member.id))}
                  onOpen={openMember}
                />
              </div>
            ))}
          </div>
        </div>
      </ContentContainer>

      {selectedMember && (
        <TeamMemberDialog
          member={selectedMember}
          details={getMemberDetails(selectedMember.id)}
          isOpen
          onClose={() => setSelectedMember(null)}
        />
      )}
    </Section>
  );
}
