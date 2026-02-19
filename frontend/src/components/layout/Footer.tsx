import { Facebook, Instagram, Linkedin, Github, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-brand-dark text-brand-light py-8 border-t border-white/10 z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Social media */}
          <div className="text-center md:text-left">
            <p className="mb-3 text-brand-light">{t('footer.follow_us')}</p>
            <div className="flex justify-center md:justify-start gap-4 mb-3">
              <a
                href="https://www.facebook.com/kolo.naukowe.algo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-light transition-colors text-2xl"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/kn_algo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-light transition-colors text-2xl"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              
              <a
                href="https://linkedin.com/company/koło-naukowe-algo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-light transition-colors text-2xl"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              
              <a
                href="https://github.com/KN-Algo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-light transition-colors text-2xl"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
            </div>
            <p className="flex items-center justify-center md:justify-start gap-2 text-brand-light">
              <Mail size={18} />
              algo.pwr@gmail.com
            </p>
          </div>

          {/* Right side - Copyright */}
          <div className="text-center md:text-right">
            <p className="mb-1 text-brand-light">
              &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </p>
            <small className="text-sm text-brand-light">{t('footer.tagline')}</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
