import React from 'react';
import { NavigationRoute } from '../../types';
import { ArrowRight, Calendar, GraduationCap, Layers, MessageSquare, Users } from 'lucide-react';
import { PROGRAM_INFO } from '../../data/mockData';
import { PROGRAM_SLIDES } from '../courses/CourseDetailsPage';
import { Manifesto } from './Manifesto';
import { CompanyMarquee } from '../common/CompanyMarquee';
import { ABOUT_CONFIG } from './aboutConfig';

interface AboutPageProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenMentorModal: () => void;
}

const SectionTitle: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => (
  <div className="text-center max-w-2xl mx-auto mb-8">
    <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">{kicker}</span>
    <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] mt-1">{title}</h2>
  </div>
);

export const AboutPage: React.FC<AboutPageProps> = ({ onRouteChange, onOpenMentorModal }) => {
  const flagship = PROGRAM_SLIDES[0];
  const teachers = PROGRAM_INFO.mentoringModel.fourTeachers;

  // Facts taken from the program data itself, so they stay true if the program changes.
  const facts = [
    { icon: Calendar, value: flagship.duration.split('(')[0].trim(), label: 'Cohort-based program' },
    { icon: Layers, value: '2 Phases', label: 'Foundations, then advanced tooling' },
    { icon: Users, value: `${teachers.length} Mentor Roles`, label: 'Instructor, lab, reviewer, career coach' },
    { icon: MessageSquare, value: '1:1 Mentorship', label: PROGRAM_INFO.mentoringModel.supportRatios },
  ];

  return (
    <div className="bg-[#08070B] text-white pb-20">

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
        <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">About Us</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Sora'] mt-2 tracking-tight">
          Technology education built around <span className="text-[#F1C40F]">you</span>
        </h1>
        <p className="text-sm sm:text-base text-[#D1CADB] mt-4 leading-relaxed">
          CodeMyWay helps beginners, career switchers and working professionals build practical technology skills through structured learning, mentor guidance and hands-on projects.
        </p>
      </section>

      {/* At a glance */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...ABOUT_CONFIG.stats.map((s) => ({ icon: GraduationCap, value: s.value, label: s.label })), ...facts].map((fact) => (
            <div key={fact.label} className="p-4 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50 text-center">
              <fact.icon className="w-5 h-5 text-[#F1C40F] mx-auto mb-2" />
              <div className="text-lg font-bold font-['Sora']">{fact.value}</div>
              <div className="text-[11px] text-[#A7A0B5] mt-0.5">{fact.label}</div>
            </div>
          ))}
        </div>
      </section>

      <CompanyMarquee />

      <Manifesto onRouteChange={onRouteChange} />

      {/* How we teach */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-24 sm:mt-32">
        <SectionTitle kicker="How we teach" title="Four mentors around every learner" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teachers.map((teacher, index) => (
            <div key={teacher.role} className="p-5 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50">
              <div className="w-8 h-8 rounded-lg bg-[#2E1A47] border border-[#5C4B8A]/60 text-[#F1C40F] flex items-center justify-center text-sm font-bold mb-3">
                {index + 1}
              </div>
              <h3 className="text-base font-semibold font-['Sora']">{teacher.role}</h3>
              <p className="text-xs text-[#D1CADB] mt-1.5 leading-relaxed">{teacher.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#D1CADB]">
          <div className="p-4 rounded-xl bg-[#1B102B] border border-[#5C4B8A]/40">
            <strong className="text-white block mb-1">Progress reviews</strong>
            {PROGRAM_INFO.mentoringModel.progressReviews}
          </div>
          <div className="p-4 rounded-xl bg-[#1B102B] border border-[#5C4B8A]/40">
            <strong className="text-white block mb-1">Guest masterclasses</strong>
            {PROGRAM_INFO.mentoringModel.guestMasterclass}
          </div>
        </div>
      </section>

      {/* Learning journey */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-24 sm:mt-32">
        <SectionTitle kicker="Your journey" title={`${flagship.curriculumTitle}: ${flagship.curriculumBadge}`} />
        <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-[#5C4B8A]/50">
          {[flagship.phase1, flagship.phase2].map((phase) => (
            <div key={phase.tag} className="relative pl-12">
              <span className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-[#F1C40F] border-4 border-[#08070B]" />
              <span className="text-[11px] font-semibold text-[#9B59B6] uppercase tracking-wider">{phase.tag}</span>
              <h3 className="text-lg font-semibold font-['Sora'] mt-0.5">{phase.title}</h3>
              <p className="text-xs text-[#D1CADB] mt-1 leading-relaxed">{phase.desc}</p>
              <ul className="mt-2 space-y-1 text-xs text-[#D1CADB]">
                {phase.items.map((item) => (
                  <li key={item.title}>• <strong className="text-white">{item.title}</strong> {item.desc}</li>
                ))}
              </ul>
              <p className="text-[11px] text-[#F1C40F] mt-2 font-medium">{phase.project}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team: shown only once filled in aboutConfig.ts */}
      {ABOUT_CONFIG.team.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-24 sm:mt-32">
          <SectionTitle kicker="The team" title="Meet the people behind CodeMyWay" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ABOUT_CONFIG.team.map((member) => (
              <div key={member.name} className="p-5 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50">
                {member.photoUrl && (
                  <img src={member.photoUrl} alt={member.name} loading="lazy" className="w-16 h-16 rounded-full object-cover mb-3" />
                )}
                <h3 className="text-base font-semibold font-['Sora']">{member.name}</h3>
                <div className="text-[11px] text-[#9B59B6] font-semibold">{member.role}</div>
                <p className="text-xs text-[#D1CADB] mt-2 leading-relaxed">{member.bio}</p>
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#F1C40F] hover:underline mt-2 inline-block">
                    LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Learner stories: shown only once filled in aboutConfig.ts */}
      {ABOUT_CONFIG.testimonials.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-24 sm:mt-32">
          <SectionTitle kicker="Learner stories" title="In their words" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ABOUT_CONFIG.testimonials.map((t) => (
              <figure key={t.name} className="p-5 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50">
                <blockquote className="text-sm text-[#D1CADB] leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-3 text-xs">
                  <strong className="text-white">{t.name}</strong>
                  <span className="text-[#A7A0B5]"> · {t.background}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-24 sm:mt-32">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#231538] via-[#2E1A47] to-[#1E1130] border border-[#F1C40F]/40 text-center">
          <h2 className="text-xl sm:text-2xl font-bold font-['Sora']">Ready to see if it is right for you?</h2>
          <p className="text-xs sm:text-sm text-[#D1CADB] mt-2">Explore the curriculum, or talk to a mentor about your background and goals.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
            <button
              onClick={() => onRouteChange('course-details')}
              className="px-6 py-2.5 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenMentorModal}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#190F29]/90 hover:bg-[#2E1A47] border border-[#5C4B8A] rounded-xl cursor-pointer"
            >
              Talk to a Mentor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
