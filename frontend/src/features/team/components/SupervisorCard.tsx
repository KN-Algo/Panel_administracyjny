import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Surface } from "@/shared";

export interface SupervisorCardProps {
  name: string;
  image: string;
  imageAlt: string;
  biography: string;
}

export default function SupervisorCard({
  name,
  image,
  imageAlt,
  biography,
}: SupervisorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Surface
      as="button"
      type="button"
      tone="white"
      radius="2xl"
      shadow="lg"
      overflow="hidden"
      cursor="pointer"
      interaction="scale"
      width="full"
      onClick={() => setIsExpanded((expanded) => !expanded)}
      aria-expanded={isExpanded}
    >
      <div className="p-5 text-center">
        <img
          src={image}
          alt={imageAlt}
          className="w-1/2 object-cover rounded-2xl mx-auto mb-4 border-[3px] border-black shadow-lg"
        />
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{name}</h3>
        <div className="flex items-center justify-center gap-2 text-brand-dark">
          <ChevronDown
            size={24}
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isExpanded ? "max-h-[500px] mt-4" : "max-h-0"
          }`}
        >
          <p
            dangerouslySetInnerHTML={{ __html: biography }}
            className="text-gray-700 text-sm leading-relaxed text-left"
          />
        </div>
      </div>
    </Surface>
  );
}
