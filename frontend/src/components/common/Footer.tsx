import React from 'react';
import { NavigationRoute } from '../../types';
import { ShieldCheck, Sparkles, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import { SOCIAL_LINKS } from '../../siteConfig';
import { POLICY_CONFIG as C } from '../legal/policyConfig';
import codemywayLogo from '../../assets/images/codemyway_logo.png';

interface FooterProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenBrochure?: () => void;
  onOpenMentorModal?: () => void;
}

const headingCls = "text-white font-semibold mb-3 text-xs tracking-wider uppercase font-['Sora']";
const linkCls = 'hover:text-white transition-colors text-left cursor-pointer';

export const Footer: React.FC<FooterProps> = ({ onRouteChange, onOpenBrochure, onOpenMentorModal }) => {
  const go = (route: NavigationRoute) => {
    onRouteChange(route);
    window.scrollTo({ top: 0 });
  };

  const socials = [
    { label: 'Instagram', url: SOCIAL_LINKS.instagram, Icon: Instagram },
    { label: 'LinkedIn', url: SOCIAL_LINKS.linkedin, Icon: Linkedin },
    { label: 'YouTube', url: SOCIAL_LINKS.youtube, Icon: Youtube },
    { label: 'X', url: SOCIAL_LINKS.x, Icon: Twitter },
  ].filter((social) => social.url);

  return (
    <footer className="bg-[#050408] text-[#D1CADB] border-t border-[#5C4B8A]/40 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_repeat(5,1fr)] gap-x-8 gap-y-10 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-3">
            <button
              onClick={() => go('home')}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B59B6] rounded cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="CodeMyWay Home"
            >
              <img
                src={codemywayLogo}
                alt="CodeMyWay - Where Skill Becomes Career"
                className="h-10 sm:h-11 w-auto object-contain drop-"
              />
            </button>
            <p className="text-[#A7A0B5] text-xs leading-relaxed">
              Premium technology education and career platform empowering beginners, career switchers, and working professionals with rigorous, hands-on learning.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#9B59B6] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Structured learning with 4-teacher support</span>
            </div>
            {socials.length > 0 && (
              <div className="flex items-center gap-4 pt-1">
                {socials.map(({ label, url, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[#D1CADB] hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Programs */}
          <div>
            <h4 className={headingCls}>Flagship Programs</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => go('course-details')} className={linkCls}>Data Analyst + GenAI (24 Weeks)</button></li>
              <li><button onClick={() => go('course-details')} className={`${linkCls} text-[#A7A0B5]`}>Phase 1: Analytical Foundations (SQL/Excel/Tableau)</button></li>
              <li><button onClick={() => go('course-details')} className={`${linkCls} text-[#A7A0B5]`}>Phase 2: Applied Python & Statistics</button></li>
              {onOpenBrochure && (
                <li>
                  <button onClick={onOpenBrochure} className="text-[#9B59B6] hover:text-violet-300 transition-colors font-medium text-left cursor-pointer">
                    Download Program Brochure
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Skill Store */}
          <div>
            <h4 className={headingCls}>Skill Store Catalog</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => go('skill-store')} className={linkCls}>SQL for Product Analytics</button></li>
              <li><button onClick={() => go('skill-store')} className={linkCls}>Advanced Excel & Power Query</button></li>
              <li><button onClick={() => go('skill-store')} className={linkCls}>Tableau BI Dashboards</button></li>
              <li><button onClick={() => go('skill-store')} className={linkCls}>GenAI Analytical Workflows</button></li>
              <li>
                <button onClick={() => go('skill-store')} className="text-[#F1C40F] hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Coming Soon: Interview Prep & Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Student */}
          <div>
            <h4 className={headingCls}>Student</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => go('login')} className="text-[#F1C40F] hover:text-amber-300 transition-colors text-left cursor-pointer font-semibold">Student Login / Register</button></li>
              <li><button onClick={() => go('student-dashboard')} className={linkCls}>Student Dashboard</button></li>
              {onOpenMentorModal && (
                <li><button onClick={onOpenMentorModal} className={linkCls}>Talk to a Mentor</button></li>
              )}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className={headingCls}>About</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => go('about')} className={linkCls}>About Us</button></li>
              <li><button onClick={() => go('contact')} className={linkCls}>Support</button></li>
              <li><button onClick={() => go('privacy')} className={linkCls}>Privacy Policy</button></li>
              <li><button onClick={() => go('refund')} className={linkCls}>Pricing and Refund</button></li>
              <li><button onClick={() => go('terms')} className={linkCls}>Terms and Conditions</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2.5">
            <h4 className={headingCls}>Contact</h4>
            {C.supportHours && <p className="text-white">{C.supportHours}</p>}
            {C.supportPhone && (
              <p><a href={`tel:${C.supportPhone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{C.supportPhone}</a></p>
            )}
            <p><a href={`mailto:${C.supportEmail}`} className="hover:text-white transition-colors break-all">{C.supportEmail}</a></p>
            {C.address && <p className="text-[#A7A0B5]">{C.address}</p>}
          </div>
        </div>

        {/* Academic standard note */}
        <div className="p-3 rounded-xl bg-[#1B102B] border border-[#5C4B8A]/40 text-[11px] text-[#D1CADB] max-w-2xl mb-8">
          <div className="text-white font-medium flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9B59B6]" />
            <span>Transparent Academic Standard</span>
          </div>
          <p className="text-[#A7A0B5]">
            We focus strictly on verifiable competencies, mock interviews, and code portfolio quality. No fabricated job guarantees or unconfirmed placement claims.
          </p>
        </div>

        <p className="border-t border-[#5C4B8A]/30 pt-6 text-[11px] text-[#A7A0B5]">
          © 2026 {C.companyName} All rights reserved.
        </p>
      </div>
    </footer>
  );
};
