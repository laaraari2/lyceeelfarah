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
      <section id="life" className="py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header Section */}
            <div className="text-center mb-16">
               {isEditable ? (
                  <input
                     type="text"
                     value={content.title}
                     onChange={(e) => onUpdate('title', e.target.value)}
                     className="text-4xl font-bold text-blue-800 mb-4 w-full text-center border-b-2 border-dashed border-yellow-400 bg-transparent"
                  />
               ) : (
                  <h2 className="text-4xl font-bold text-blue-800 mb-4">{content.title}</h2>
               )}

               {isEditable ? (
                  <textarea
                     value={content.description}
                     onChange={(e) => onUpdate('description', e.target.value)}
                     className="w-full max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed border border-dashed border-yellow-400 p-2 rounded bg-transparent text-center"
                     rows={3}
                  />
               ) : (
                  <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                     {content.description}
                  </p>
               )}
            </div>

            {/* Clubs Grid */}
            {content.clubs && content.clubs.length > 0 && (
               <div className="mb-16">
                  <h3 className="text-2xl font-bold text-center text-blue-700 mb-10">
                     {language === 'ar' ? '🎯 أنديتنا التربوية' : '🎯 Nos Clubs Éducatifs'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {content.clubs.map((club, index) => (
                        <div
                           key={club.id}
                           className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
                           style={{ animationDelay: `${index * 100}ms` }}
                        >
                           {/* Card Header with Gradient */}
                           <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white relative overflow-hidden">
                              {/* Decorative circles */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>

                              <div className="relative z-10 flex items-center gap-4">
                                 <span className="text-5xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {club.icon}
                                 </span>
                                 <h4 className="text-xl font-bold leading-tight">
                                    {club.name}
                                 </h4>
                              </div>
                           </div>

                           {/* Card Body */}
                           <div className="p-6">
                              <p className={`text-gray-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                 {club.description}
                              </p>
                           </div>

                           {/* Card Footer */}
                           <div className="px-6 pb-6">
                              <div className="flex items-center justify-between text-sm text-gray-400">
                                 <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {language === 'ar' ? 'أسبوعياً' : 'Hebdomadaire'}
                                 </span>
                                 <span className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                                    {language === 'ar' ? 'المزيد ←' : '→ En savoir plus'}
                                 </span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Image Section */}
            <div className="max-w-4xl mx-auto">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <ImageUploader
                     src={content.image}
                     alt="School Life"
                     onUpload={(base64) => onUpdate('image', base64)}
                     isEditable={isEditable}
                     className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                     <p className="text-lg font-medium drop-shadow-lg">
                        {language === 'ar'
                           ? '✨ ننظم رحلات استكشافية ومسابقات رياضية وثقافية على مدار السنة'
                           : '✨ Nous organisons des excursions et compétitions tout au long de l\'année'}
                     </p>
                  </div>
               </div>
            </div>

         </div>
      </section>
   );
};

export default SchoolLife;