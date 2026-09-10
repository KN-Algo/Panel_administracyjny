import { ArrowRight } from "lucide-react";

import { IconFrame, Surface } from "@/shared";
import type { TeamMember } from "@/types";

interface MemberCardProps {
  member: TeamMember;
  positionLabel: string | null;
  hasDetails: boolean;
  onOpen: (member: TeamMember) => void;
}

export default function MemberCard({
  member,
  positionLabel,
  hasDetails,
  onOpen,
}: MemberCardProps) {
  const fullName = `${member.firstName} ${member.lastName}`;

  return (
    <Surface
      as="button"
      type="button"
      disabled={!hasDetails}
      onClick={() => onOpen(member)}
      tone="brand"
      radius="2xl"
      shadow="lg"
      overflow="hidden"
      interaction="rise"
      position="relative"
      width="full"
      cursor={hasDetails ? "pointer" : "default"}
      textAlign="left"
      group
      aria-label={hasDetails ? fullName : undefined}
    >
      {hasDetails && (
        <IconFrame
          size="sm"
          tone="glass"
          placement="cardCorner"
          interaction="nudge"
        >
          <ArrowRight size={14} />
        </IconFrame>
      )}
      <div className="py-5 px-5 flex flex-col items-center">
        <div className="mb-0">
          <img
            src={member.image.replace("../img/", "/img/")}
            alt={fullName}
            className="w-[270px] h-[350px] object-cover rounded-2xl border-[3px] border-white transition-transform duration-300 hover:scale-105"
          />
        </div>
        <h3 className="text-white text-base font-normal text-center mb-1 mt-4">
          {fullName}
        </h3>
        {positionLabel && (
          <p className="text-white text-sm font-bold">{positionLabel}</p>
        )}
      </div>
    </Surface>
  );
}
