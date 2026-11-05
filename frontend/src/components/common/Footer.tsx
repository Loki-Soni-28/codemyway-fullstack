import React from 'react';
import { NavigationRoute } from '../../types';
import { Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import { SOCIAL_LINKS } from '../../siteConfig';
import { POLICY_CONFIG as C } from '../legal/policyConfig';
import codemywayLogo from '../../assets/images/codemyway_logo.png';

interface FooterProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenBrochure?: () => void;
  onOpenMentorModal?: () => void;
}

const headingCls = "text-white font-semibold mb-4 text-xs tracking-wider uppercase font-['Sora']";
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
    <footer className="bg-[#050408] text-[#A7A0B5] border-t border-white/10 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(3,1fr)] gap-x-10 gap-y-10">

          {/* Brand */}
          <div className="space-y-4">
            <button
              onClick={() => go('home')}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B59B6] rounded cursor-pointer"
              aria-label="CodeMyWay Home"
            >
              <img src={codemywayLogo} alt="CodeMyWay - Where Skill Becomes Career" className="h-10 w-auto object-contain" />
            </button>
            {socials.length > 0 && (
              <div className="flex items-center gap-4">
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

          {/* Explore */}
          <div>
            <h4 className={headingCls}>Explore</h4>
            <ul className="space-y-3">
              <li><button onClick={() => go('course-details')} className={linkCls}>Programs</button></li>
              <li><button onClick={() => go('skill-store')} className={linkCls}>Skill Store</button></li>
              {onOpenBrochure && <li><button onClick={onOpenBrochure} className={linkCls}>Download Brochure</button></li>}
              {onOpenMentorModal && <li><button onClick={onOpenMentorModal} className={linkCls}>Talk to a Mentor</button></li>}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className={headingCls}>About</h4>
            <ul className="space-y-3">
              <li><button onClick={() => go('about')} className={linkCls}>About Us</button></li>
              <li><button onClick={() => go('contact')} className={linkCls}>Support</button></li>
              <li><button onClick={() => go('privacy')} className={linkCls}>Privacy Policy</button></li>
              <li><button onClick={() => go('refund')} className={linkCls}>Pricing and Refund</button></li>
              <li><button onClick={() => go('terms')} className={linkCls}>Terms and Conditions</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={headingCls}>Contact</h4>
            <ul className="space-y-3">
              {C.supportHours && <li className="text-white">{C.supportHours}</li>}
              {C.supportPhone && (
                <li><a href={`tel:${C.supportPhone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{C.supportPhone}</a></li>
              )}
              <li><a href={`mailto:${C.supportEmail}`} className="hover:text-white transition-colors break-all">{C.supportEmail}</a></li>
              {C.address && <li>{C.address}</li>}
            </ul>
          </div>
        </div>

        <p className="mt-12 pt-6 border-t border-white/10 text-xs text-[#6F6880]">
          © 2026 {C.companyName} All rights reserved.
        </p>
      </div>
    </footer>
  );
};
