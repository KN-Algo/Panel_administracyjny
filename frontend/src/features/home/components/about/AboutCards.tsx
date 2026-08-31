import AboutCard, { type AboutCardProps } from "./AboutCard";

export interface AboutCardsProps {
  cards: AboutCardProps[];
}

export default function AboutCards({ cards }: AboutCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {cards.map((card) => (
        <AboutCard key={card.title} {...card} />
      ))}
    </div>
  );
}
