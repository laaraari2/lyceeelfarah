import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { IconBookOpen, IconBriefcase } from './Icons';
import { getAllLessons, createLesson, deleteLesson, Lesson } from '../services/lessonsService';
import { uploadPDF } from '../services/storageService';
import { supabase } from '../lib/supabase';

interface TeacherDashboardProps {
  language: Language;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ language }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('');
  const [contentType, setContentType] = useState<'lesson' | 'exercise'>('lesson');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const classes = [
    "1ère Année Collège", "2ème Année Collège", "3ème Année Collège", "Tronc Commun", "1ère Bac", "2ème Bac"
  ];

  const subjects = [
    "الرياضيات", "الفيزياء", "العلوم", "الفرنسية", "الإنجليزية", "العربية", "التاريخ", "الجغرافيا"
  ];

  // جلب معرف الأستاذ عند التحميل
  useEffect(() => {
    const fetchTeacherId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('teachers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setTeacherId(data.id);
        }
      }
    };
    fetchTeacherId();
  }, []);

  // جلب الدروس عند التحميل
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    const result = await getAllLessons();
    if (result.success && result.data) {
      setLessons(result.data);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert(language === 'ar' ? 'المرجو تحميل ملف بصيغة PDF فقط' : 'Veuillez télécharger un fichier PDF uniquement');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedClass || !subject || !file || !teacherId) {
      alert(language === 'ar' ? 'المرجو ملء جميع الخانات' : 'Veuillez remplir tous les champs');
      return;
    }

    setUploading(true);

    try {
      // 1. رفع الملف إلى Storage
      const uploadResult = await uploadPDF(file, teacherId);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'فشل رفع الملف');
      }

      // 2. حفظ معلومات الدرس في قاعدة البيانات
      const lessonData = {
        title,
        description,
        class_level: selectedClass,
        subject,
        type: contentType,
        file_url: uploadResult.data.publicUrl,
        file_name: file.name,
        teacher_id: teacherId
      };

      const createResult = await createLesson(lessonData);

      if (!createResult.success) {
        throw new Error(createResult.error || 'فشل حفظ الدرس');
      }

      // 3. تحديث القائمة
      await fetchLessons();

      // 4. إعادة تعيين النموذج
      setTitle('');
      setDescription('');
      setSubject('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      alert(language === 'ar' ? 'تم رفع الملف بنجاح!' : 'Fichier téléchargé avec succès!');
    } catch (error: any) {
      console.error('Error uploading lesson:', error);
      alert(language === 'ar' ? `خطأ: ${error.message}` : `Erreur: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الدرس؟' : 'Êtes-vous sûr de supprimer cette leçon?')) {
      return;
    }

    const result = await deleteLesson(id);
    if (result.success) {
      await fetchLessons();
      alert(language === 'ar' ? 'تم الحذف بنجاح' : 'Supprimé avec succès');
    } else {
      alert(language === 'ar' ? 'فشل الحذف' : 'Échec de la suppression');
    }
  };

  const t = {
    title: language === 'ar' ? 'فضاء الأستاذ' : 'Espace Enseignant',
    uploadTitle: language === 'ar' ? 'إضافة محتوى جديد' : 'Ajouter un nouveau contenu',
    listTitle: language === 'ar' ? 'الملفات المرفوعة' : 'Fichiers téléchargés',
    classLabel: language === 'ar' ? 'اختر القسم' : 'Choisir la classe',
    subjectLabel: language === 'ar' ? 'المادة' : 'Matière',
    descriptionLabel: language === 'ar' ? 'الوصف (اختياري)' : 'Description (optionnel)',
    typeLabel: language === 'ar' ? 'نوع المحتوى' : 'Type de contenu',
    lesson: language === 'ar' ? 'درس' : 'Leçon',
    exercise: language === 'ar' ? 'تمرين' : 'Exercice',
    titleLabel: language === 'ar' ? 'عنوان الدرس/التمرين' : 'Titre',
    fileLabel: language === 'ar' ? 'تحميل ملف (PDF)' : 'Télécharger fichier (PDF)',
    submit: language === 'ar' ? 'نشر المحتوى' : 'Publier',
    noFiles: language === 'ar' ? 'لا توجد ملفات مرفوعة حالياً' : 'Aucun fichier téléchargé',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    tableHeader: {
      title: language === 'ar' ? 'العنوان' : 'Titre',
      subject: language === 'ar' ? 'المادة' : 'Matière',
      class: language === 'ar' ? 'القسم' : 'Classe',
      type: language === 'ar' ? 'النوع' : 'Type',
      date: language === 'ar' ? 'التاريخ' : 'Date',
      actions: language === 'ar' ? 'الإجراءات' : 'Actions'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="bg-yassamine-blue p-3 rounded-xl text-white shadow-lg">
            <IconBriefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-yassamine-blue mb-6 border-b pb-2">{t.uploadTitle}</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.classLabel}</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yassamine-blue focus:border-transparent outline-none transition"
                  >
                    <option value="">-- {t.classLabel} --</option>
                    {classes.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.subjectLabel}</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yassamine-blue focus:border-transparent outline-none transition"
                  >
                    <option value="">-- {t.subjectLabel} --</option>
                    {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.typeLabel}</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition ${contentType === 'lesson' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="radio" name="contentType" className="hidden" checked={contentType === 'lesson'} onChange={() => setContentType('lesson')} />
                      <IconBookOpen className="w-5 h-5" />
                      {t.lesson}
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition ${contentType === 'exercise' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="radio" name="contentType" className="hidden" checked={contentType === 'exercise'} onChange={() => setContentType('exercise')} />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      {t.exercise}
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.titleLabel}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yassamine-blue focus:border-transparent outline-none transition"
                    placeholder={language === 'ar' ? 'مثال: تمارين الرياضيات الفصل الأول' : 'Ex: Exercices de Math Chapitre 1'}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.descriptionLabel}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yassamine-blue focus:border-transparent outline-none transition"
                    rows={2}
                    placeholder={language === 'ar' ? 'وصف مختصر للدرس...' : 'Brève description...'}
                  />
                </div>

                {/* PDF File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.fileLabel}</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer group">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 group-hover:text-yassamine-blue transition mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p className="text-sm text-gray-500 font-medium">
                        {file ? (
                          <span className="text-green-600 font-bold">{file.name}</span>
                        ) : (
                          language === 'ar' ? 'اضغط للتحميل (PDF)' : 'Cliquez pour télécharger (PDF)'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-yassamine-blue hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (language === 'ar' ? 'جاري الرفع...' : 'Téléchargement...') : t.submit}
                </button>
              </form>
            </div>
          </div>

          {/* Files List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">{t.listTitle}</h2>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-500">
                  <p>{t.loading}</p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>{t.noFiles}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4 text-start">{t.tableHeader.title}</th>
                        <th className="px-6 py-4 text-start">{t.tableHeader.subject}</th>
                        <th className="px-6 py-4 text-start">{t.tableHeader.class}</th>
                        <th className="px-6 py-4 text-start">{t.tableHeader.type}</th>
                        <th className="px-6 py-4 text-start">{t.tableHeader.date}</th>
                        <th className="px-6 py-4 text-center">{t.tableHeader.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lessons.map((lesson) => (
                        <tr key={lesson.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-red-100 p-2 rounded text-red-600">
                                <span className="text-xs font-bold">PDF</span>
                              </div>
                              <span className="font-bold text-gray-800">{lesson.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700 text-sm">{lesson.subject}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                              {lesson.class_level}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {lesson.type === 'lesson' ? (
                              <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs font-bold">{t.lesson}</span>
                            ) : (
                              <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-xs font-bold">{t.exercise}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(lesson.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <a
                                href={lesson.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yassamine-blue hover:text-blue-800 hover:bg-blue-50 p-2 rounded-full transition"
                                title={language === 'ar' ? 'تحميل' : 'Télécharger'}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                              </a>
                              <button
                                onClick={() => handleDelete(lesson.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition"
                                title={language === 'ar' ? 'حذف' : 'Supprimer'}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;