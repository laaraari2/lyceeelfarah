import React from 'react';
import { Language, EducationalLevel } from '../types';
import ImageUploader from './ImageUploader';

interface LevelsProps {
  language: Language;
  content: {
    sectionTitle: string;
    items: EducationalLevel[];
  };
  isEditable: boolean;
  onUpdateTitle: (val: string) => void;
  onUpdateItem: (id: number, field: keyof EducationalLevel, val: string) => void;
}

const Levels: React.FC<LevelsProps> = ({ language, content, isEditable, onUpdateTitle, onUpdateItem }) => {
  return (
    <section id="levels" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {isEditable ? (
            <input
              type="text"
              value={content.sectionTitle}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="text-3xl font-bold text-gray-900 mb-4 text-center bg-transparent border-b-2 border-dashed border-yellow-400 focus:outline-none w-full md:w-1/2 mx-auto"
            />
          ) : (
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {content.sectionTitle}
            </h2>
          )}
          <div className="w-24 h-1 bg-yassamine-gold mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {content.items.map((level, index) => (
            <div
              key={level.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 group flex flex-col relative animate-scale-in`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="h-48 overflow-hidden relative">
                <ImageUploader
                  src={level.image}
                  alt={level.title}
                  onUpload={(base64) => onUpdateItem(level.id, 'image', base64)}
                  isEditable={isEditable}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                  {isEditable ? (
                    <textarea
                      value={level.subLevels}
                      onChange={(e) => onUpdateItem(level.id, 'subLevels', e.target.value)}
                      className="text-sm text-yassamine-blue bg-blue-50 p-2 rounded-lg w-full h-32 border border-dashed border-yellow-400 resize-none font-medium leading-relaxed"
                      placeholder="Enter levels separated by new lines"
                    />
                  ) : (
                    <div className="text-sm font-medium text-yassamine-blue bg-blue-50 p-4 rounded-lg w-full shadow-inner">
                      <ul className="space-y-1">
                        {level.subLevels.split('\n').map((subLevel, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 text-yassamine-gold transform group-hover:rotate-12 transition-transform">•</span>
                            <span>{subLevel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {isEditable ? (
                  <input
                    type="text"
                    value={level.title}
                    onChange={(e) => onUpdateItem(level.id, 'title', e.target.value)}
                    className="text-xl font-bold text-gray-900 mb-3 w-full border-b border-dashed border-yellow-400"
                  />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yassamine-blue transition-colors">
                    {level.title}
                  </h3>
                )}

                {isEditable ? (
                  <textarea
                    value={level.description}
                    onChange={(e) => onUpdateItem(level.id, 'description', e.target.value)}
                    className="text-gray-600 text-sm leading-relaxed flex-grow w-full border border-dashed border-yellow-400 p-1 resize-none h-24"
                  />
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {level.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Levels;