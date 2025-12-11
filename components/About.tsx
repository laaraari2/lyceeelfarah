import React from 'react';
import { Language, AboutContent } from '../types';
import ImageUploader from './ImageUploader';

interface AboutProps {
  language: Language;
  content: AboutContent;
  isEditable: boolean;
  onUpdate: (key: keyof AboutContent, value: string) => void;
}

const About: React.FC<AboutProps> = ({ language, content, isEditable, onUpdate }) => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
           <div className="w-full lg:w-1/2">
              <div className="relative group">
                 <ImageUploader 
                    src={content.image} 
                    alt="Teacher" 
                    onUpload={(base64) => onUpdate('image', base64)}
                    isEditable={isEditable}
                    className="rounded-2xl shadow-2xl z-10 relative object-cover w-full h-[400px]"
                    containerClassName="z-10 relative"
                 />
                 <div className="absolute -bottom-6 -right-6 w-full h-full bg-yassamine-light rounded-2xl -z-0 hidden lg:block"></div>
              </div>
           </div>
           <div className="w-full lg:w-1/2">
              {isEditable ? (
                 <input
                    type="text"
                    value={content.title}
                    onChange={(e) => onUpdate('title', e.target.value)}
                    className="w-full text-3xl font-bold text-yassamine-blue mb-6 border-2 border-dashed border-yellow-400 p-2 rounded"
                 />
              ) : (
                 <h2 className="text-3xl font-bold text-yassamine-blue mb-6">
                   {content.title}
                 </h2>
              )}

              {isEditable ? (
                 <textarea
                    value={content.description}
                    onChange={(e) => onUpdate('description', e.target.value)}
                    className="w-full text-gray-600 text-lg leading-relaxed mb-6 border-2 border-dashed border-yellow-400 p-2 rounded h-40"
                 />
              ) : (
                 <p className="text-gray-600 text-lg leading-relaxed mb-6">
                   {content.description}
                 </p>
              )}

              {isEditable ? (
                 <input
                    type="text"
                    value={content.ctaText}
                    onChange={(e) => onUpdate('ctaText', e.target.value)}
                    className="text-yassamine-blue font-bold border-b-2 border-dashed border-yellow-400 pb-1"
                 />
              ) : (
                 <button className="text-yassamine-blue font-bold border-b-2 border-yassamine-gold pb-1 hover:text-blue-800 transition">
                    {content.ctaText}
                 </button>
              )}
           </div>
        </div>
      </div>
    </section>
  );
};

export default About;