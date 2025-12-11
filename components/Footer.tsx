import React from 'react';
import { Language, FooterContent } from '../types';

interface FooterProps {
  language: Language;
  content: FooterContent;
  isEditable: boolean;
  onUpdate: (key: keyof FooterContent, value: string) => void;
}

const Footer: React.FC<FooterProps> = ({ language, content, isEditable, onUpdate }) => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo.jpg" alt="Logo" className="w-10 h-10 object-cover rounded-full" />
              <span className="font-bold text-xl">LYCÉE ELFARAH</span>
            </div>
            {isEditable ? (
              <textarea
                value={content.description}
                onChange={(e) => onUpdate('description', e.target.value)}
                className="w-full bg-transparent border border-dashed border-yellow-400 text-gray-400 text-sm leading-relaxed mb-6 h-24"
              />
            ) : (
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {content.description}
              </p>
            )}


            <div className="flex gap-4">
              <a href="https://web.facebook.com/lycee.farah.9" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yassamine-blue transition cursor-pointer">fb</a>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yassamine-blue transition cursor-pointer">in</div>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yassamine-blue transition cursor-pointer">ig</div>
            </div>
          </div>

          {/* Links */}
          <div>
            {isEditable ? (
              <input
                type="text"
                value={content.linksTitle}
                onChange={(e) => onUpdate('linksTitle', e.target.value)}
                className="text-lg font-bold mb-6 text-yassamine-gold bg-transparent border-b border-dashed border-white w-full"
              />
            ) : (
              <h4 className="text-lg font-bold mb-6 text-yassamine-gold">
                {content.linksTitle}
              </h4>
            )}

            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">{language === 'ar' ? 'من نحن' : 'Qui sommes-nous'}</a></li>
              <li><a href="#" className="hover:text-white transition">{language === 'ar' ? 'مشروعنا التربوي' : 'Projet Éducatif'}</a></li>
              <li><a href="#" className="hover:text-white transition">{language === 'ar' ? 'الحياة المدرسية' : 'Vie Scolaire'}</a></li>
              <li><a href="#" className="hover:text-white transition">{language === 'ar' ? 'توظيف' : 'Recrutement'}</a></li>
            </ul>
          </div>


          {/* Location Map */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-yassamine-gold">
              {language === 'ar' ? 'موقعنا' : 'Notre Localisation'}
            </h4>
            <div className="w-full h-48 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8!2d-7.5898!3d33.5898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLyc%C3%A9e%20El%20Farah!5e0!3m2!1sfr!2sma!4v1234567890!5m2!1sfr!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={language === 'ar' ? 'موقع المدرسة' : 'School Location'}
              ></iframe>
            </div>
            <p className="text-gray-400 text-xs mt-3">
              {language === 'ar'
                ? '3، زنقة 68، حي الأمل 2، الدار البيضاء الفداء'
                : '3, Rue 68, Hay Al Amal 2, Casablanca Fida'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          {/* Copyright and Links Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 text-xs text-gray-500">
            {isEditable ? (
              <input
                type="text"
                value={content.copyrightText}
                onChange={(e) => onUpdate('copyrightText', e.target.value)}
                className="bg-transparent border-b border-dashed border-white w-64 text-gray-500"
              />
            ) : (
              <p>{content.copyrightText}</p>
            )}
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">{language === 'ar' ? 'سياسة الخصوصية' : 'Confidentialité'}</a>
              <a href="#" className="hover:text-white transition">{language === 'ar' ? 'الشروط والأحكام' : 'Termes & Conditions'}</a>
            </div>
          </div>

          {/* Developer Credit - Centered */}
          <div className="text-center pt-4 border-t border-gray-800/50">
            <p className="text-sm text-white flex items-center justify-center gap-2">
              <span>💻</span>
              <span>
                {language === 'ar'
                  ? 'تطوير: لعرعري مصطفى'
                  : 'Développé par: LAARAARI MUSTAPHA'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;