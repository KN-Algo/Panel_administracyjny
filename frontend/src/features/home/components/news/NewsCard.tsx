import { Link } from "react-router-dom";

export interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  eventId?: string;
  readMoreLabel: string;
}

export default function NewsCard({
  title,
  description,
  image,
  eventId,
  readMoreLabel,
}: NewsCardProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <Link
        to="/events"
        state={{ eventId }}
        className="block bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-[580px] flex flex-col group"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-contain bg-neutral-lightest flex-shrink-0"
        />
        <div className="p-6 bg-neutral-lighter flex-grow flex flex-col justify-between">
          <div className="flex-grow">
            <h3 className="font-semibold text-xl mb-2 text-black line-clamp-2 group-hover:text-brand-dark transition-colors">
              {title}
            </h3>
            <p className="text-gray-700 text-base mb-4 line-clamp-4">
              {description}
            </p>
          </div>
          <span className="inline-block bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors group-hover:bg-brand-dark-hover text-center mt-auto">
            {readMoreLabel}
          </span>
        </div>
      </Link>
    </div>
  );
}
