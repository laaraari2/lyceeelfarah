import React, { useState } from 'react';
import { Language, TeacherMaterial, LessonsPageContent } from '../types';
import { IconBookOpen, IconSearch, IconX, IconBriefcase, IconDownload, IconEye, IconFileText, IconChevronDown } from './Icons';

interface LessonsPageProps {
    language: Language;
    content: LessonsPageContent;
    materials: TeacherMaterial[];
    isEditable: boolean;
    onUpdate: (key: keyof LessonsPageContent, value: string) => void;
}

const LessonsPage: React.FC<LessonsPageProps> = ({ language, content, materials, isEditable, onUpdate }) => {
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedType, setSelectedType] = useState<'all' | 'lesson' | 'exercise'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [previewMaterial, setPreviewMaterial] = useState<TeacherMaterial | null>(null);

    const classes = [
        "1ère Année Collège", "2ème Année Collège", "3ème Année Collège", "Tronc Commun", "1ère Bac", "2ème Bac"
    ];

    const filteredMaterials = materials.filter(m => {
        const classMatch = selectedClass ? m.className === selectedClass : true;
        const typeMatch = selectedType === 'all' ? true : m.type === selectedType;
        const searchMatch = searchQuery
            ? m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return classMatch && typeMatch && searchMatch;
    });

    const t = {
        classFilter: language === 'ar' ? 'المستوى الدراسي' : 'Niveau Scolaire',
        typeFilter: language === 'ar' ? 'نوع المحتوى' : 'Type de contenu',
        all: language === 'ar' ? 'الكل' : 'Tout',
        lesson: language === 'ar' ? 'درس' : 'Leçon',
        exercise: language === 'ar' ? 'تمرين' : 'Exercice',
        noMaterials: language === 'ar' ? 'لا توجد موارد مطابقة لبحثك.' : 'Aucune ressource ne correspond à votre recherche.',
        download: language === 'ar' ? 'تحميل' : 'Télécharger',
        preview: language === 'ar' ? 'معاينة' : 'Aperçu',
        searchPlaceholder: language === 'ar' ? 'ابحث عن درس أو تمرين...' : 'Rechercher une leçon ou un exercice...',
        results: language === 'ar' ? 'نتائج' : 'Résultats',
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12 animate-slide-up">
                    {isEditable ? (
                        <input
                            type="text"
                            value={content.title}
                            onChange={(e) => onUpdate('title', e.target.value)}
                            className="text-4xl font-bold text-yassamine-blue mb-4 bg-transparent border-b-2 border-dashed border-yellow-400 text-center w-full md:w-1/2 mx-auto focus:outline-none"
                        />
                    ) : (
                        <h1 className="text-4xl font-bold text-yassamine-blue mb-4">{content.title}</h1>
                    )}

                    <div className="w-24 h-1 bg-yassamine-gold mx-auto rounded mb-6"></div>

                    {isEditable ? (
                        <textarea
                            value={content.description}
                            onChange={(e) => onUpdate('description', e.target.value)}
                            className="w-full max-w-2xl text-gray-600 text-lg leading-relaxed bg-transparent border border-dashed border-yellow-400 p-2 rounded h-24 mx-auto block focus:outline-none"
                        />
                    ) : (
                        <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
                            {content.description}
                        </p>
                    )}
                </div>

                {/* Search & Filters Container */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col gap-6 animate-slide-up delay-100">

                    {/* Search Bar */}
                    <div className="relative w-full max-w-3xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {language !== 'ar' && <IconSearch className="h-5 w-5 text-gray-400" />}
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {language === 'ar' && <IconSearch className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`block w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yassamine-blue transition-all shadow-sm text-lg`}
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-t border-gray-100 pt-6 mt-2">
                        {/* Class Filter */}
                        <div className="w-full md:w-1/3 relative">
                            {/* <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.classFilter}</label> */}
                            <div className="relative">
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 rounded-lg py-3 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-yassamine-blue focus:border-transparent cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
                                >
                                    <option value="">{t.all} - {t.classFilter}</option>
                                    {classes.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                </select>
                                <div className={`pointer-events-none absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center px-2 text-gray-500`}>
                                    <IconChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {/* Type Toggle */}
                        <div className="flex bg-gray-100 p-1.5 rounded-xl w-full md:w-auto">
                            <button
                                onClick={() => setSelectedType('all')}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedType === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t.all}
                            </button>
                            <button
                                onClick={() => setSelectedType('lesson')}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedType === 'lesson' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t.lesson}
                            </button>
                            <button
                                onClick={() => setSelectedType('exercise')}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedType === 'exercise' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t.exercise}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMaterials.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 animate-fade-in shadow-sm">
                            <div className="bg-gray-50 p-6 rounded-full mb-6">
                                <IconBookOpen className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{t.noMaterials}</h3>
                            <p className="text-gray-400 max-w-md text-center">
                                {language === 'ar'
                                    ? 'جرب البحث بكلمات مختلفة أو تغيير الفلاتر.'
                                    : 'Essayez de rechercher avec d\'autres mots-clés ou modifiez les filtres.'}
                            </p>
                        </div>
                    ) : (
                        filteredMaterials.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col animate-scale-in relative transform hover:-translate-y-1"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`absolute top-0 inset-x-0 h-1.5 ${item.type === 'lesson' ? 'bg-blue-500' : 'bg-yellow-400'}`}></div>

                                <div className="p-7 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-5">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${item.type === 'lesson' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                            }`}>
                                            {item.type === 'lesson' ? t.lesson : t.exercise}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                            {item.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-yassamine-blue transition-colors line-clamp-2 leading-tight">
                                        {item.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-6">
                                        <IconBriefcase className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm text-gray-500 font-medium">{item.className}</p>
                                    </div>

                                    <div className="mt-auto flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 group-hover:border-gray-200 transition-colors">
                                        <IconFileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                                        <span className="truncate font-medium">{item.fileName}</span>
                                    </div>
                                </div>

                                <div className="px-7 pb-7 pt-0 flex gap-3">
                                    <button
                                        onClick={() => setPreviewMaterial(item)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-yassamine-blue hover:text-yassamine-blue text-gray-600 font-bold py-3 rounded-xl transition-all duration-200"
                                    >
                                        <IconEye className="w-5 h-5" />
                                        {t.preview}
                                    </button>

                                    <a
                                        href={item.fileUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-yassamine-blue hover:bg-yassamine-blue/90 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <IconDownload className="w-5 h-5" />
                                        {t.download}
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* PDF Preview Modal */}
            {previewMaterial && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
                        onClick={() => setPreviewMaterial(null)}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col animate-scale-in overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${previewMaterial.type === 'lesson' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                    <IconFileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{previewMaterial.title}</h3>
                                    <p className="text-xs text-gray-500">{previewMaterial.className}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setPreviewMaterial(null)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-grow bg-gray-100 relative overflow-hidden">
                            {previewMaterial.fileUrl ? (
                                <iframe
                                    src={previewMaterial.fileUrl}
                                    className="w-full h-full border-0"
                                    title={previewMaterial.title}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center p-8">
                                        <IconFileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium text-lg">
                                            {language === 'ar' ? 'لا يوجد ملف للمعاينة' : 'Aucun fichier à prévisualiser'}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            {previewMaterial.fileName}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            {previewMaterial.fileUrl && (
                                <a
                                    href={previewMaterial.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                    {language === 'ar' ? 'فتح في نافذة جديدة' : 'Ouvrir dans un nouvel onglet'}
                                </a>
                            )}
                            <a
                                href={previewMaterial.fileUrl || '#'}
                                download
                                className="flex items-center gap-2 bg-yassamine-blue hover:bg-yassamine-blue/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
                            >
                                <IconDownload className="w-5 h-5" />
                                {t.download}
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default LessonsPage;
