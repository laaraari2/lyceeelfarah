import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { IconGraduationCap, IconBookOpen, IconDownload } from './Icons';
import { getAllLessons, Lesson } from '../services/lessonsService';

interface StudentDashboardProps {
   language: Language;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ language }) => {
   const [selectedClass, setSelectedClass] = useState<string>('');
   const [selectedSubject, setSelectedSubject] = useState<string>('');
   const [lessons, setLessons] = useState<Lesson[]>([]);
   const [loading, setLoading] = useState(true);

   const classes = [
      "1ère Année Collège", "2ème Année Collège", "3ème Année Collège", "Tronc Commun", "1ère Bac", "2ème Bac"
   ];

   const subjects = [
      "الرياضيات", "الفيزياء", "العلوم", "الفرنسية", "الإنجليزية", "العربية", "التاريخ", "الجغرافيا"
   ];

   useEffect(() => {
      const fetchLessons = async () => {
         setLoading(true);
         const result = await getAllLessons();
         if (result.success && result.data) {
            setLessons(result.data);
         }
         setLoading(false);
      };
      fetchLessons();
   }, []);

   const filteredLessons = lessons.filter(lesson => {
      const classMatch = selectedClass ? lesson.class_level === selectedClass : true;
      const subjectMatch = selectedSubject ? lesson.subject === selectedSubject : true;
      return classMatch && subjectMatch;
   });

   const t = {
      title: language === 'ar' ? 'فضاء التلميذ' : 'Espace Élève',
      subtitle: language === 'ar' ? 'دروسي وتماريني' : 'Mes leçons et exercices',
      filterClass: language === 'ar' ? 'المستوى' : 'Niveau',
      filterSubject: language === 'ar' ? 'المادة' : 'Matière',
      all: language === 'ar' ? 'الكل' : 'Tout',
      noMaterials: language === 'ar' ? 'لا توجد دروس متاحة حالياً' : 'Aucune leçon disponible',
      lesson: language === 'ar' ? 'درس' : 'Leçon',
      exercise: language === 'ar' ? 'تمرين' : 'Exercice',
      download: language === 'ar' ? 'تحميل' : 'Télécharger',
      preview: language === 'ar' ? 'معاينة' : 'Aperçu',
      loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
      resultsCount: language === 'ar' ? 'نتائج' : 'résultats',
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

               {/* Filters */}
               <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <select
                     value={selectedClass}
                     onChange={(e) => setSelectedClass(e.target.value)}
                     className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-yassamine-gold text-sm"
                  >
                     <option value="">{t.all} - {t.filterClass}</option>
                     {classes.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                  <select
                     value={selectedSubject}
                     onChange={(e) => setSelectedSubject(e.target.value)}
                     className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-yassamine-gold text-sm"
                  >
                     <option value="">{t.all} - {t.filterSubject}</option>
                     {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
               </div>
            </div>

            {/* Results count */}
            {!loading && (
               <div className="mb-6 text-sm text-gray-500">
                  {filteredLessons.length} {t.resultsCount}
               </div>
            )}

            {/* Content Grid */}
            {loading ? (
               <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yassamine-blue border-r-transparent mb-4"></div>
                  <p className="text-gray-500">{t.loading}</p>
               </div>
            ) : filteredLessons.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                  <IconBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">{t.noMaterials}</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLessons.map((lesson) => (
                     <div key={lesson.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
                        <div className={`h-2 w-full ${lesson.type === 'lesson' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                        <div className="p-6 flex-grow">
                           <div className="flex justify-between items-start mb-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${lesson.type === 'lesson' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                 }`}>
                                 {lesson.type === 'lesson' ? t.lesson : t.exercise}
                              </span>
                              <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
                                 {new Date(lesson.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
                              </span>
                           </div>

                           <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-yassamine-blue transition-colors line-clamp-2">
                              {lesson.title}
                           </h3>

                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-gray-500">{lesson.class_level}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{lesson.subject}</span>
                           </div>

                           {lesson.description && (
                              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{lesson.description}</p>
                           )}

                           <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                 <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{lesson.file_name || 'file.pdf'}</span>
                           </div>
                        </div>

                        <div className="px-6 pb-6 pt-0 flex gap-2">
                           <a
                              href={lesson.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all duration-300 text-sm"
                           >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {t.preview}
                           </a>
                           <a
                              href={lesson.file_url}
                              download
                              className="flex-1 flex items-center justify-center gap-2 bg-yassamine-blue hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl transition-all duration-300 text-sm"
                           >
                              <IconDownload className="w-4 h-4" />
                              {t.download}
                           </a>
                        </div>
                     </div>
                  ))}
               </div>
            )}

         </div>
      </div>
   );
};

export default StudentDashboard;