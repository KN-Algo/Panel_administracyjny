import { useTranslation } from "react-i18next";
import { Code, Lightbulb, FlaskConical } from "lucide-react";

interface TileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

function AnimatedTile({
  icon,
  title,
  description,
  gradient,
  delay,
}: TileProps) {
  return (
    <div
      className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-700 group-hover:text-white/90 leading-relaxed transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
}

export default function AboutSection() {
  const { t } = useTranslation();

  const tiles = [
    {
      icon: (
        <Code className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
      ),
      title: t("home.about_tile1_title"),
      description: t("home.about_tile1_desc"),
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      delay: 0,
    },
    {
      icon: (
        <Lightbulb className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
      ),
      title: t("home.about_tile2_title"),
      description: t("home.about_tile2_desc"),
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      delay: 150,
    },
    {
      icon: (
        <FlaskConical className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
      ),
      title: t("home.about_tile3_title"),
      description: t("home.about_tile3_desc"),
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      delay: 300,
    },
  ];

  return (
    <div className="relative w-full py-20 bg-gradient-to-b from-gray-50 to-white z-10">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16 group cursor-default">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight transition-all duration-300 group-hover:scale-[1.02]">
            {t("home.about_title")}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 mx-auto rounded-full mb-6 shadow-sm transition-all duration-500 group-hover:w-48 group-hover:shadow-md"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            {t("home.about_subtitle")}
          </p>
        </div>

        {/* Animated Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tiles.map((tile, index) => (
            <AnimatedTile key={index} {...tile} />
          ))}
        </div>

        {/* Bottom text */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="px-8 py-6 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all duration-300 hover:bg-gray-100/50 hover:border-gray-200 hover:shadow-md hover:-translate-y-1 cursor-default">
            <p className="text-lg text-gray-700 leading-relaxed">
              {t("home.about_footer_text")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
