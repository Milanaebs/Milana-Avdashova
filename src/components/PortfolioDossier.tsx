import React from 'react';
import { Briefcase, GraduationCap, Award, Languages, Mail, Phone, MapPin, FileDown, ArrowUpRight } from 'lucide-react';
import { ProfileData } from '../types';

interface PortfolioDossierProps {
  profile: ProfileData;
  onAskQuestion: (question: string) => void;
  onOpenCV: () => void;
}

export const PortfolioDossier: React.FC<PortfolioDossierProps> = ({
  profile,
  onAskQuestion,
  onOpenCV,
}) => {
  return (
    <div className="space-y-16">
      {/* Editorial Hero Statement */}
      <section id="overview" className="border-b border-[#EAE4D9] pb-12">
        <div className="flex items-center gap-2 text-xs text-[#78716C] uppercase tracking-wider mb-3">
          <span>Executive Dossier</span>
          <span aria-hidden="true">·</span>
          <span>Tallinn, Estonia</span>
          <span aria-hidden="true">·</span>
          <span>BSc Candidate 2024–Present</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#1C1917] leading-tight text-balance">
          Bridging International Business Administration, Rigorous Financial Audit & Client Experience
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#44403C] leading-relaxed max-w-3xl">
          {profile.about}
        </p>

        {/* Contact Strip without pill boxes */}
        <div className="mt-8 pt-6 border-t border-[#EAE4D9]/80 flex flex-wrap items-center gap-y-3 gap-x-8 text-sm text-[#57534E]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#9A6735]" />
            <a href={`mailto:${profile.email}`} className="hover:text-[#1C1917] transition-colors">
              {profile.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#9A6735]" />
            <a href={`tel:${profile.phone}`} className="hover:text-[#1C1917] transition-colors">
              {profile.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#9A6735]" />
            <span>{profile.location}</span>
          </div>
          <button
            onClick={onOpenCV}
            className="cursor-pointer ml-auto flex items-center gap-2 text-[#9A6735] hover:text-[#78350F] font-medium transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Certified CV (PDF)</span>
          </button>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="border-b border-[#EAE4D9] pb-12">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
              Professional Experience & Practice
            </h2>
            <p className="text-sm text-[#78716C] mt-1">
              Audit analysis, corporate financial reporting, and high-standard communication
            </p>
          </div>
          <button
            onClick={() => onAskQuestion('Tell me about your audit experience at Sirius Audit and what tests you perform.')}
            className="cursor-pointer hidden sm:flex items-center gap-1.5 text-xs text-[#9A6735] hover:underline"
          >
            <span>Ask Milana about this</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#EAE4D9]">
          {profile.experience.map((exp, index) => (
            <article key={index} className="py-7 first:pt-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-lg font-medium text-[#1C1917]">{exp.company}</h3>
                  <p className="font-serif italic text-base text-[#78716C]">{exp.role}</p>
                </div>
                <div className="text-xs tabular-nums text-[#78716C] font-medium">
                  {exp.period}
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[#44403C]">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#9A6735] select-none mt-1">―</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* Internship */}
          {profile.internship.map((intern, index) => (
            <article key={`intern-${index}`} className="py-7">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-[#1C1917]">{intern.company}</h3>
                    <span className="text-xs text-[#9A6735] uppercase tracking-wider font-medium">· Internship</span>
                  </div>
                  <p className="font-serif italic text-base text-[#78716C]">{intern.role}</p>
                </div>
                <div className="text-xs tabular-nums text-[#78716C] font-medium">
                  {intern.period}
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[#44403C]">
                {intern.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#9A6735] select-none mt-1">―</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="border-b border-[#EAE4D9] pb-12">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
              Academic Background
            </h2>
            <p className="text-sm text-[#78716C] mt-1">
              Higher education in international business and secondary foundations
            </p>
          </div>
          <button
            onClick={() => onAskQuestion('How does your degree at Estonian Business School connect with your career goals?')}
            className="cursor-pointer hidden sm:flex items-center gap-1.5 text-xs text-[#9A6735] hover:underline"
          >
            <span>Ask Milana about EBS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#EAE4D9]">
          {profile.education.map((edu, index) => (
            <article key={index} className="py-6 first:pt-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-lg font-medium text-[#1C1917]">{edu.institution}</h3>
                  <p className="font-serif italic text-base text-[#78716C]">{edu.degree}</p>
                </div>
                <div className="text-xs tabular-nums text-[#78716C] font-medium">
                  {edu.period}
                </div>
              </div>
              <p className="mt-3 text-sm text-[#44403C] leading-relaxed">
                {edu.details}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Competencies, Software & Languages Grid */}
      <section id="competencies" className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12">
        {/* Left Column: Core Strengths & Software */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-medium text-[#1C1917]">
            Core Disciplines & Software
          </h2>
          <p className="text-sm text-[#78716C]">
            Practical software proficiencies and character traits honed through sports & business
          </p>

          <div className="pt-2">
            <h4 className="text-xs uppercase tracking-wider font-medium text-[#78716C] mb-3">
              Specialized Software Tools
            </h4>
            <div className="space-y-2 text-sm text-[#1C1917]">
              <div className="flex justify-between border-b border-[#EAE4D9]/60 pb-2">
                <span className="font-medium">Inflo Audit Software</span>
                <span className="text-[#78716C] text-xs">Sirius Audit OÜ</span>
              </div>
              <div className="flex justify-between border-b border-[#EAE4D9]/60 pb-2">
                <span className="font-medium">Merit Aktiva Software</span>
                <span className="text-[#78716C] text-xs">OG Accounting OÜ</span>
              </div>
              <div className="flex justify-between border-b border-[#EAE4D9]/60 pb-2">
                <span className="font-medium">Microsoft Excel (Advanced)</span>
                <span className="text-[#78716C] text-xs">Financial Modeling & Tests</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-xs uppercase tracking-wider font-medium text-[#78716C] mb-3">
              Professional Attributes
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#44403C]">
              {profile.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A6735]" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Language Proficiency */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-medium text-[#1C1917]">
            Language Proficiencies
          </h2>
          <p className="text-sm text-[#78716C]">
            Trilingual agility across international corporate and local Estonian environments
          </p>

          <div className="divide-y divide-[#EAE4D9] pt-2">
            {profile.languages.map((lang, index) => (
              <div key={index} className="py-3.5 first:pt-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-medium text-[#1C1917]">{lang.language}</span>
                  <span className="text-xs font-serif italic text-[#9A6735]">{lang.level}</span>
                </div>
                <p className="text-xs text-[#78716C] mt-1">{lang.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#F9F6F0] border border-[#EAE4D9] text-xs text-[#57534E] leading-relaxed">
            <span className="font-medium text-[#1C1917]">Spoken Voice Persona Notice:</span> Milana is configured to speak naturally in both English (with an American accent) and Russian (with a native Russian accent), matching her educational and cultural background.
          </div>
        </div>
      </section>
    </div>
  );
};
