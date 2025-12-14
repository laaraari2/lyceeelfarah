import React from 'react';
import { Language, SiteContent } from '../types';
import ImageUploader from './ImageUploader';

interface HeroProps {
  language: Language;
  content: SiteContent['hero'];
  isEditable: boolean;
  onUpdate: (key: keyof SiteContent['hero'], value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ language, content, isEditable, onUpdate }) => {
  // Increased resolution to 2560x1440 for high quality on large screens
  const [heroImage, setHeroImage] = React.useState(content.image || `${import.meta.env.BASE_URL}images/farah.png`);

  React.useEffect(() => {
    if (content.image) {
      setHeroImage(content.image);
    }
  }, [content.image]);

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-40">
        <ImageUploader
          src={heroImage}
          alt="Students learning"
          onUpload={(base64) => {
            setHeroImage(base64);
            onUpdate('image', base64);
          }}
          isEditable={isEditable}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
          overlayText="Change Background"
        />
      </div>

      {/* Animated Gradient Overlay - Added pointer-events-none to allow clicking the image uploader behind (or put uploader on top if desired, but here we want image back) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-transparent to-cyan-900/30 pointer-events-none"></div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-300 pointer-events-none"></div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pointer-events-none">
        <div className={`max-w-2xl ${language === 'ar' ? 'text-right' : 'text-left'} pointer-events-auto`}>

          {/* Title */}
          <div className="animate-slide-up">
            {isEditable ? (
              <textarea
                value={content.title}
                onChange={(e) => onUpdate('title', e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight border-2 border-dashed border-yellow-400 rounded-lg p-2 focus:outline-none focus:bg-white/30 resize-none"
                rows={2}
              />
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                {content.title}
              </h1>
            )}
          </div>

          {/* Subtitle */}
          <div className="animate-slide-up delay-100">
            {isEditable ? (
              <textarea
                value={content.subtitle}
                onChange={(e) => onUpdate('subtitle', e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-lg md:text-xl text-gray-100 mb-10 leading-relaxed border-2 border-dashed border-yellow-400 rounded-lg p-2 focus:outline-none focus:bg-white/30 resize-none"
                rows={3}
              />
            ) : (
              <p className="text-lg md:text-xl text-gray-100 mb-10 leading-relaxed drop-shadow-md">
                {content.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
            {/* CTA 1 */}
            {isEditable ? (
              <input
                type="text"
                value={content.ctaPrimary}
                onChange={(e) => onUpdate('ctaPrimary', e.target.value)}
                className="bg-yassamine-gold text-yassamine-blue font-bold py-3.5 px-4 rounded-full border-2 border-dashed border-white w-40 text-center"
              />
            ) : (
              <button className="bg-gradient-accent hover:shadow-glow-gold text-white font-bold py-4 px-10 rounded-full shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95">
                {content.ctaPrimary}
              </button>
            )}

            {/* CTA 2 */}
            {isEditable ? (
              <input
                type="text"
                value={content.ctaSecondary}
                onChange={(e) => onUpdate('ctaSecondary', e.target.value)}
                className="glass text-white font-semibold py-3.5 px-4 rounded-full border-2 border-dashed border-yellow-400 w-48 text-center"
              />
            ) : (
              <button className="glass hover:bg-white/20 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:-translate-y-1">
                {content.ctaSecondary}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Wave at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-gray-50"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;