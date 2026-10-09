import AboutCard, { type AboutCardProps } from "./AboutCard";

export interface AboutCardsProps {
  cards: AboutCardProps[];
}

export default function AboutCards({ cards }: AboutCardsProps) {
  return (
    <div className="home-about__cards grid grid-cols-3 gap-8 mb-16">
      {cards.map((card) => (
        <AboutCard key={card.title} {...card} />
      ))}
    </div>
  );
}
