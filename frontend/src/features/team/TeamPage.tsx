import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import teamData from '@/data/team.json';
import type { TeamMember } from '@/types';

export default function TeamPage() {
  const { t } = useTranslation();
  const [martaExpanded, setMartaExpanded] = useState(false);
  const [jacekExpanded, setJacekExpanded] = useState(false);

  const members = teamData as TeamMember[];

  const getPositionLabel = (position?: string) => {
    if (!position) return null;
    return t(`team.${position}`);
  };

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <section className="py-14 text-center bg-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t('team.page_title')}
          </h1>
          <p className="text-base text-gray-600">
            {t('team.page_subtitle')}
          </p>
        </div>
      </section>

      {/* Group Photo Section */}
      <section className="py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <img
              src="/img/kn_algo_grupowe1.webp"
              alt="Zdjęcie zespołu"
              className="w-full rounded-3xl shadow-xl transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Supervisors Introduction Section */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-14 text-gray-900">
            {t('team.supervisors_title')}
          </h2>
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
                <p
                  dangerouslySetInnerHTML={{ __html: t('team.supervisors_intro') }}
                  className="text-base leading-relaxed"
                />
                <p className="text-base leading-relaxed">
                  {t('team.supervisors_intro_p2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supervisors Cards Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Marta Lampasiak */}
              <div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
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
                  <div className="flex items-center justify-center gap-2 text-[#000424]">
                    <ChevronDown
                      size={24}
                      className={`transition-transform duration-300 ${
                        martaExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      martaExpanded ? 'max-h-500 mt-4' : 'max-h-0'
                    }`}
                  >
                    <p
                      dangerouslySetInnerHTML={{ __html: t('team.marta_bio') }}
                      className="text-gray-700 text-sm leading-relaxed text-left"
                    />
                  </div>
                </div>
              </div>

              {/* Jacek Jagodziński */}
              <div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
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
                  <div className="flex items-center justify-center gap-2 text-[#000424]">
                    <ChevronDown
                      size={24}
                      className={`transition-transform duration-300 ${
                        jacekExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      jacekExpanded ? 'max-h-[2000px] mt-4' : 'max-h-0'
                    }`}
                  >
                    <p
                      dangerouslySetInnerHTML={{ __html: t('team.jacek_bio') }}
                      className="text-gray-700 text-sm leading-relaxed text-left"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-14 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-14 text-gray-900">
            {t('team.members_title')}
          </h2>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="bg-[#000424] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="py-5 px-5 flex flex-col items-center">
                    <div className="mb-0">
                      <img
                        src={member.image.replace('../img/', '/img/')}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-67.5 h-87.5 object-cover rounded-2xl border-[3px] border-white transition-transform duration-300 hover:scale-105"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
