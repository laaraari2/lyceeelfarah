import React, { useState } from 'react';
import { Language, TeacherMaterial } from '../types';
import { IconGraduationCap, IconBookOpen } from './Icons';

interface StudentDashboardProps {
   language: Language;
   materials: TeacherMaterial[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ language, materials }) => {
   // Mock logged-in student class. In a real app, this comes from user profile.
   // We allow the user to select their class to simulate the experience.
   const [selectedClass, setSelectedClass] = useState<string>('');

   const classes = [
      "1ère Année Collège", "2ème Année Collège", "3ème Année Collège", "Tronc Commun", "1ère Bac", "2ème Bac"
   ];

   const filteredMaterials = selectedClass
      ? materials.filter(m => m.className === selectedClass)
      : materials;

   const t = {
      title: language === 'ar' ? 'فضاء التلميذ' : 'Espace Élève',
      subtitle: language === 'ar' ? 'دروسي وتماريني' : 'Mes leçons et exercices',
      filterLabel: language === 'ar' ? 'اختر قسمك لعرض الموارد:' : 'Sélectionnez votre classe :',
      noClassSelected: language === 'ar' ? 'المرجو اختيار القسم لعرض الدروس' : 'Veuillez sélectionner une classe pour voir les leçons',
      noMaterials: language === 'ar' ? 'لا توجد دروس متاحة لهذا القسم حالياً' : 'Aucune leçon disponible pour cette classe',
      lesson: language === 'ar' ? 'درس' : 'Leçon',
      exercise: language === 'ar' ? 'تمرين' : 'Exercice',
      download: language === 'ar' ? 'تحميل' : 'Télécharger',
   };

   return (
      <div className="min-h-screen bg-gray-50 py-12">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="bg-yassamine-gold p-3 rounded-xl text-yassamine-blue shadow-lg">
                     <IconGraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
                     <p className="text-gray-500">{t.subtitle}</p>
                  </div>
               </div>

               {/* Class Filter */}
               <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-sm font-bold text-gray-700 whitespace-nowrap px-2">{t.filterLabel}</span>
                  <select
                     value={selectedClass}
                     onChange={(e) => setSelectedClass(e.target.value)}
                     className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-yassamine-gold"
                  >
                     <option value="">-- {language === 'ar' ? 'الكل' : 'Tout'} --</option>
                     {classes.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
               </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {materials.length === 0 ? (
                  <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm">
                     <p className="text-gray-400 text-lg">{t.noMaterials}</p>
                  </div>
               ) : filteredMaterials.length === 0 ? (
                  <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm">
                     <p className="text-gray-400 text-lg">{selectedClass ? t.noMaterials : t.noClassSelected}</p>
                  </div>
               ) : (
                  filteredMaterials.map((item) => (
                     <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
                        <div className={`h-2 w-full ${item.type === 'lesson' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                        <div className="p-6 flex-grow">
                           <div className="flex justify-between items-start mb-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.type === 'lesson' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                 }`}>
                                 {item.type === 'lesson' ? t.lesson : t.exercise}
                              </span>
                              <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
                                 {item.date}
                              </span>
                           </div>

                           <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-yassamine-blue transition-colors line-clamp-2">
                              {item.title}
                           </h3>
                           <p className="text-sm text-gray-500 mb-4">{item.className}</p>

                           <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 bg-gray-50 p-2 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                 <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{item.fileName}</span>
                           </div>
                        </div>

                        <div className="px-6 pb-6 pt-0">
                           <button className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-yassamine-blue hover:text-white text-gray-700 font-bold py-2.5 rounded-xl transition-all duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              {t.download}
                           </button>
                        </div>
                     </div>
                  ))
               )}
            </div>

         </div>
      </div>
   );
};

export default StudentDashboard;