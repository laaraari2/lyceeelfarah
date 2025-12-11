import React from 'react';
import { Language, LifeContent } from '../types';
import ImageUploader from './ImageUploader';

interface SchoolLifeProps {
  language: Language;
  content: LifeContent;
  isEditable: boolean;
  onUpdate: (key: keyof LifeContent, value: string) => void;
}

const SchoolLife: React.FC<SchoolLifeProps> = ({ language, content, isEditable, onUpdate }) => {
  return (
    <section id="life" className="py-20 bg-white overflow-hidden">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col md:flex-row items-center gap-12 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
             
             {/* Text Content */}
             <div className="w-full md:w-1/2">
                {isEditable ? (
                   <input
                     type="text"
                     value={content.title}
                     onChange={(e) => onUpdate('title', e.target.value)}
                     className="text-3xl font-bold text-yassamine-blue mb-6 w-full border-b-2 border-dashed border-yellow-400"
                   />
                ) : (
                   <h2 className="text-3xl font-bold text-yassamine-blue mb-6">{content.title}</h2>
                )}

                {isEditable ? (
                   <textarea
                     value={content.description}
                     onChange={(e) => onUpdate('description', e.target.value)}
                     className="w-full h-64 text-gray-600 text-lg leading-relaxed border border-dashed border-yellow-400 p-2 rounded"
                   />
                ) : (
                   <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                      {content.description}
                   </p>
                )}
             </div>

             {/* Image */}
             <div className="w-full md:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                   <ImageUploader 
                      src={content.image} 
                      alt="School Life" 
                      onUpload={(base64) => onUpdate('image', base64)}
                      isEditable={isEditable}
                      className="w-full h-[400px] object-cover"
                   />
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

export default SchoolLife;