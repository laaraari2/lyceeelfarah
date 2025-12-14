import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Levels from './components/Levels';
import About from './components/About';
import Rules from './components/Rules';
import SchoolLife from './components/SchoolLife';
import News from './components/News';
import LessonsPage from './components/LessonsPage';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Toast, { ToastType } from './components/Toast';
import { Language, UserRole, MultiLangContent, SiteContent, EducationalLevel, NewsItem } from './types';
import { getLanguageContent, saveAllContent } from './services/contentService';
import { getPublicLessons, Lesson } from './services/lessonsService';
import { onAuthStateChange } from './services/authService';

// Initial Data for the CMS with High Resolution Images
const INITIAL_CONTENT: MultiLangContent = {
    ar: {
        navItems: [
            { id: 1, label: 'الرئيسية', href: 'home' },
            { id: 2, label: 'القانون الداخلي', href: 'rules' },
            { id: 3, label: 'البيداغوجيا', href: 'levels' },
            { id: 4, label: 'الحياة المدرسية', href: 'life' },
            { id: 5, label: 'أخبار', href: 'news' },
            { id: 6, label: 'دروس و تمارين', href: 'lessons' },
        ],
        hero: {
            title: "نحو التميز والإبداع",
            subtitle: "في ثانوية الفرح الخصوصية، نربي أجيال الغد على قيم المواطنة والابتكار والتفوق الأكاديمي.",
            ctaPrimary: "سجل الآن",
            ctaSecondary: "اكتشف مدارسنا",
        },
        stats: [
            { id: 1, value: "35+", label: "سنة من التميز", icon: null },
            { id: 2, value: "4000+", label: "طالب سعيد", icon: null },
            { id: 3, value: "100%", label: "نجاح في البكالوريا", icon: null },
            { id: 4, value: "3", label: "لغات (عربية، فرنسية، إنجليزية)", icon: null },
        ],
        levels: {
            sectionTitle: "مسارنا البيداغوجي",
            items: [
                {
                    id: 1,
                    title: "التعليم الإعدادي",
                    description: "مرحلة انتقالية هامة تعزز الاستقلالية والتفكير النقدي والتحضير للثانوي.",
                    subLevels: "الأولى إعدادي\nالثانية إعدادي\nالثالثة إعدادي",
                    image: "https://picsum.photos/seed/middle/1200/800"
                },
                {
                    id: 2,
                    title: "التعليم التأهيلي",
                    description: "توجيه أكاديمي دقيق وإعداد مكثف للبكالوريا والتعليم العالي.",
                    subLevels: "جذع مشترك علمي\nالأولى بكالوريا علوم تجريبية\nالثانية بكالوريا علوم الحياة و الأرض\nالثانية بكالوريا علوم فيزيائية",
                    image: "https://picsum.photos/seed/high/1200/800"
                }
            ]
        },
        about: {
            title: 'كلمة المدير',
            description: "منذ تأسيس ثانوية الفرح الخصوصية سنة 1982، حرصت المؤسسة على بناء فضاء تربوي يجمع بين الجدية وجودة التعلمات. وعلى امتداد أربعة عقود من العمل، ظل هدفنا الأساسي هو توفير بيئة تعليمية آمنة ومحفزة، تُنمّي قدرات كل تلميذ وتفتح أمامه آفاق التميز.\n\nوتولي ثانوية الفرح اهتماماً كبيراً بـ الأنشطة المندمجة باعتبارها جزءاً أساسياً من تكوين شخصية التلميذ، فهي تساهم في تنمية روح الإبداع، وبناء الثقة في النفس، وتعزيز مهارات التواصل والعمل الجماعي. كما نعتمد برامج تربوية حديثة تحترم قيمنا الوطنية وتنفتح في الوقت نفسه على اللغات والثقافات العالمية.",
            image: `${import.meta.env.BASE_URL}images/directeur.png`,
            ctaText: 'اقرأ المزيد عن تاريخنا'
        },
        rules: {
            title: "القانون الداخلي",
            items: [
                "الالتزام بالحضور في الأوقات المحددة .",
                "احترام الأطر التربوية والإدارية وجميع العاملين بالمؤسسة.",
                "المحافظة على ممتلكات المؤسسة وتجهيزاتها ونظافتها.",
                "يمنع استعمال الهاتف المحمول داخل الفصول الدراسية.",
                "المشاركة الفعالة في الأنشطة المدرسية والحياة الجماعية."
            ]
        },
        life: {
            title: "الحياة المدرسية",
            description: "نحرص في ثانوية الفرح على توفير حياة مدرسية غنية ومتنوعة تساهم في صقل شخصية التلميذ. نوادينا التربوية تفتح أبوابها أسبوعياً لتنمية المواهب والمهارات.",
            image: "https://picsum.photos/seed/activity/1600/1200",
            clubs: [
                { id: 1, name: "نادي الفن", description: "فضاء للإبداع والتعبير الفني من خلال الرسم والتلوين والأشغال اليدوية، حيث يكتشف التلاميذ مواهبهم الفنية.", icon: "🎨" },
                { id: 2, name: "نادي الصحة والبيئة", description: "يهدف إلى تعزيز الوعي الصحي والبيئي لدى التلاميذ من خلال أنشطة التوعية والمحافظة على البيئة.", icon: "🌿" },
                { id: 3, name: "نادي التربية على المواطنة", description: "يعزز قيم المواطنة والانتماء للوطن من خلال أنشطة تربوية وثقافية متنوعة.", icon: "🏛️" },
                { id: 4, name: "النادي الرياضي", description: "يوفر فرصة لممارسة مختلف الأنشطة الرياضية وتعزيز روح الفريق والمنافسة الشريفة.", icon: "⚽" },
                { id: 5, name: "نادي الصحافة", description: "ينمي مهارات الكتابة والتحرير الصحفي وإنتاج المحتوى الإعلامي المدرسي.", icon: "📰" },
                { id: 6, name: "نادي الإنصات", description: "فضاء للدعم النفسي والاجتماعي حيث يجد التلاميذ من يستمع إليهم ويساعدهم.", icon: "👂" }
            ]
        },
        news: {
            title: "آخر الأخبار",
            items: [
                { id: 1, title: "ذكرى المسيرة الخضراء", date: "06 نونبر 2024", summary: "تخليداً لذكرى المسيرة الخضراء المظفرة، نظمت المؤسسة أنشطة تربوية وفنية لترسيخ قيم المواطنة لدى الناشئة.", image: "https://picsum.photos/seed/event1/1200/900", videoUrl: "https://www.youtube.com/watch?v=u8y4m5biv5Y" },
                { id: 2, title: "اللقاء الثقافي الربيعي", date: "20 ماي 2024", summary: "أيام ثقافية مفتوحة تضمنت عروضاً مسرحية وورشات فنية من إبداع تلاميذ المؤسسة، بحضور أولياء الأمور.", image: "https://picsum.photos/seed/event2/1200/900" },
                { id: 3, title: "رحلة إلى إفران", date: "10 أبريل 2024", summary: "نظم النادي البيئي رحلة استكشافية إلى مدينة إفران للتعرف على التنوع البيولوجي وترسيخ الوعي البيئي.", image: "https://picsum.photos/seed/event3/1200/900" }
            ]
        },
        lessonsPage: {
            title: "فضاء الدروس و التمارين",
            description: "مكتبة رقمية شاملة تضم جميع الدروس والتمارين الموجهة لتلامذتنا الأعزاء، مرتبة حسب المستوى والمادة.",
        },
        footer: {
            description: "ملتزمون بتقديم تعليم عالي الجودة يجمع بين الأصالة والمعاصرة لتنشئة جيل مبدع ومسؤول.",
            linksTitle: 'روابط سريعة',
            campusesTitle: 'مدارسنا',
            newsletterTitle: 'النشرة الإخبارية',
            newsletterText: 'اشترك للحصول على آخر التحديثات',
            copyrightText: '© 2024 Lycée El Farah. All Rights Reserved.'
        }
    },
    fr: {
        navItems: [
            { id: 1, label: 'Accueil', href: 'home' },
            { id: 2, label: 'Règlement', href: 'rules' },
            { id: 3, label: 'Pédagogie', href: 'levels' },
            { id: 4, label: 'Vie Scolaire', href: 'life' },
            { id: 5, label: 'Actualités', href: 'news' },
            { id: 6, label: 'Cours et Exercices', href: 'lessons' },
        ],
        hero: {
            title: "Vers l'Excellence et l'Innovation",
            subtitle: "Au Lycée El Farah, nous éduquons les générations futures sur les valeurs de citoyenneté, d'innovation et d'excellence académique.",
            ctaPrimary: "Inscrivez-vous",
            ctaSecondary: "Découvrez notre lycée",
        },
        stats: [
            { id: 1, value: "35+", label: "Années d'Excellence", icon: null },
            { id: 2, value: "4000+", label: "Élèves Épanouis", icon: null },
            { id: 3, value: "100%", label: "Réussite au Bac", icon: null },
            { id: 4, value: "3", label: "Langues (Ar, Fr, Ang)", icon: null },
        ],
        levels: {
            sectionTitle: "Notre Parcours Pédagogique",
            items: [
                {
                    id: 1,
                    title: "Collège",
                    description: "Une phase de transition importante favorisant l'autonomie, la pensée critique et la préparation au lycée.",
                    subLevels: "1ère Année Collège\n2ème Année Collège\n3ème Année Collège",
                    image: "https://picsum.photos/seed/middle/1200/800"
                },
                {
                    id: 2,
                    title: "Lycée",
                    description: "Orientation académique précise et préparation intensive au Baccalauréat et à l'enseignement supérieur.",
                    subLevels: "Tronc Commun Scientifique\n1ère Bac Sc. Exp\n2ème Bac SVT\n2ème Bac PC",
                    image: "https://picsum.photos/seed/high/1200/800"
                }
            ]
        },
        about: {
            title: 'Mot du Fondateur',
            description: "Depuis la fondation du Lycée El Farah, notre objectif a toujours été de créer un environnement d'apprentissage inclusif et distingué. Nous croyons que chaque enfant possède un potentiel créatif, et notre mission est de libérer ce potentiel et de le guider vers le succès. Nous allions valeurs marocaines authentiques et ouverture sur le monde.",
            image: `${import.meta.env.BASE_URL}images/directeur.png`,
            ctaText: 'En savoir plus sur notre histoire'
        },
        rules: {
            title: "Règlement Intérieur",
            items: [
                "Respecter les horaires et porter l'uniforme scolaire.",
                "Respecter le personnel éducatif, administratif et tous les employés.",
                "Préserver les équipements et la propreté de l'établissement.",
                "L'utilisation du téléphone portable est interdite en classe.",
                "Participation active aux activités scolaires et à la vie collective."
            ]
        },
        life: {
            title: "Vie Scolaire",
            description: "Au Lycée El Farah, nous veillons à offrir une vie scolaire riche et diversifiée. Nos clubs éducatifs ouvrent leurs portes chaque semaine pour développer les talents et compétences.",
            image: "https://picsum.photos/seed/activity/1600/1200",
            clubs: [
                { id: 1, name: "Club d'Art", description: "Un espace de créativité et d'expression artistique à travers le dessin, la peinture et les travaux manuels.", icon: "🎨" },
                { id: 2, name: "Club Santé et Environnement", description: "Vise à renforcer la sensibilisation à la santé et à l'environnement à travers des activités de protection.", icon: "🌿" },
                { id: 3, name: "Club Éducation à la Citoyenneté", description: "Renforce les valeurs de citoyenneté et d'appartenance à travers des activités éducatives et culturelles.", icon: "🏛️" },
                { id: 4, name: "Club Sportif", description: "Offre l'opportunité de pratiquer diverses activités sportives et de renforcer l'esprit d'équipe.", icon: "⚽" },
                { id: 5, name: "Club Journalisme", description: "Développe les compétences en écriture, rédaction et production de contenu médiatique scolaire.", icon: "📰" },
                { id: 6, name: "Club d'Écoute", description: "Un espace de soutien psychologique et social où les élèves trouvent une oreille attentive.", icon: "👂" }
            ]
        },
        news: {
            title: "Dernières Actualités",
            items: [
                { id: 1, title: "Marche Verte", date: "06 Novembre 2024", summary: "En commémoration de la glorieuse Marche Verte, l'école a organisé des activités éducatives et artistiques pour ancrer les valeurs de citoyenneté.", image: "https://picsum.photos/seed/event1/1200/900", videoUrl: "https://www.youtube.com/watch?v=u8y4m5biv5Y" },
                { id: 2, title: "Rencontre Culturelle du Printemps", date: "20 Mai 2024", summary: "Des journées culturelles portes ouvertes comprenant des pièces de théâtre et des ateliers artistiques créés par nos élèves.", image: "https://picsum.photos/seed/event2/1200/900" },
                { id: 3, title: "Excursion à Ifrane", date: "10 Avril 2024", summary: "Le club environnement a organisé une excursion éducative à Ifrane pour découvrir la biodiversité et sensibiliser à l'écologie.", image: "https://picsum.photos/seed/event3/1200/900" }
            ]
        },
        lessonsPage: {
            title: "Espace Cours et Exercices",
            description: "Une bibliothèque numérique complète comprenant toutes les leçons et exercices destinés à nos chers élèves, classés par niveau et matière.",
        },
        footer: {
            description: "Engagés à fournir une éducation de haute qualité combinant authenticité et modernité pour élever une génération créative et responsable.",
            linksTitle: 'Liens Rapides',
            campusesTitle: 'Nos Campus',
            newsletterTitle: 'Newsletter',
            newsletterText: 'Abonnez-vous pour les dernières mises à jour',
            copyrightText: '© 2024 Lycée El Farah. All Rights Reserved.'
        }
    }
};

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('ar');
    const [currentUser, setCurrentUser] = useState<UserRole>(null);
    const [content, setContent] = useState<MultiLangContent>(INITIAL_CONTENT);
    const [activePage, setActivePage] = useState<string>('home');
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [publicLessons, setPublicLessons] = useState<Lesson[]>([]); // الدروس العامة
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    // Load content from database on app start
    useEffect(() => {
        const loadContent = async () => {
            try {
                const arResult = await getLanguageContent('ar');
                const frResult = await getLanguageContent('fr');

                // Helpers
                const isObject = (item: any) => {
                    return (item && typeof item === 'object' && !Array.isArray(item));
                };

                const deepMerge = (target: any, source: any) => {
                    const output = { ...target };
                    if (isObject(target) && isObject(source)) {
                        Object.keys(source).forEach(key => {
                            if (isObject(source[key])) {
                                if (!(key in target)) {
                                    Object.assign(output, { [key]: source[key] });
                                } else {
                                    output[key] = deepMerge(target[key], source[key]);
                                }
                            } else {
                                Object.assign(output, { [key]: source[key] });
                            }
                        });
                    }
                    return output;
                };

                const fixImagePaths = (obj: any): any => {
                    if (typeof obj === 'string') {
                        if (obj.startsWith('/images/')) {
                            const baseUrl = import.meta.env.BASE_URL;
                            if (baseUrl !== '/' && obj.startsWith(baseUrl)) return obj;
                            return `${baseUrl}${obj.substring(1)}`;
                        }
                        return obj;
                    }
                    if (Array.isArray(obj)) {
                        return obj.map(item => fixImagePaths(item));
                    }
                    if (isObject(obj)) {
                        const newObj: any = {};
                        Object.keys(obj).forEach(key => {
                            newObj[key] = fixImagePaths(obj[key]);
                        });
                        return newObj;
                    }
                    return obj;
                };

                const newContent: MultiLangContent = { ...INITIAL_CONTENT };

                // Merge Arabic content
                if (arResult.success && arResult.data && arResult.data.length > 0) {
                    const arContent: any = {};
                    arResult.data.forEach((item: any) => {
                        if (item.content) {
                            arContent[item.section] = item.content;
                        }
                    });
                    newContent.ar = deepMerge(INITIAL_CONTENT.ar, arContent);
                }

                // Merge French content
                if (frResult.success && frResult.data && frResult.data.length > 0) {
                    const frContent: any = {};
                    frResult.data.forEach((item: any) => {
                        if (item.content) {
                            frContent[item.section] = item.content;
                        }
                    });
                    newContent.fr = deepMerge(INITIAL_CONTENT.fr, frContent);
                }

                setContent(fixImagePaths(newContent));
            } catch (error) {
                console.error('Error loading content:', error);
                // Keep INITIAL_CONTENT as fallback
            }
        };

        loadContent();
    }, []);

    // Load public lessons
    useEffect(() => {
        const loadPublicLessons = async () => {
            const result = await getPublicLessons();
            if (result.success && result.data) {
                setPublicLessons(result.data);
            }
        };
        loadPublicLessons();
    }, [activePage]); // Reload when page changes

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    // Restore session on load
    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange((user) => {
            if (user) {
                console.log('🔄 Session Restored:', user.role);
                setCurrentUser(user.role as UserRole);
            } else {
                setCurrentUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = (role: UserRole) => {
        // setCurrentUser will be updated by onAuthStateChange
        if (role === 'admin') {
            setActivePage('home');
        } else {
            setActivePage('dashboard');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActivePage('home');
    };

    const isEditable = currentUser === 'admin';

    // Manual save handler
    const handleSaveContent = useCallback(async () => {
        if (!isEditable) return;

        setSaveStatus('saving');
        try {
            const result = await saveAllContent(language, content[language]);
            if (result.success) {
                setSaveStatus('saved');
                setHasUnsavedChanges(false);
                console.log('Content saved successfully');
                showToast(language === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Modifications enregistrées avec succès', 'success');
            } else {
                setSaveStatus('unsaved');
                console.error('Failed to save content:', result.error);
                showToast(language === 'ar' ? 'فشل حفظ التعديلات' : 'Échec de la sauvegarde', 'error');
            }
        } catch (error) {
            setSaveStatus('unsaved');
            console.error('Error saving content:', error);
            showToast(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Erreur lors de la sauvegarde', 'error');
        }
    }, [isEditable, language, content]);

    // Auto-save with debounce
    useEffect(() => {
        if (!isEditable || !hasUnsavedChanges) return;

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            handleSaveContent();
        }, 3000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [content, isEditable, hasUnsavedChanges, handleSaveContent]);

    // Mark content as changed
    const markAsUnsaved = useCallback(() => {
        if (isEditable) {
            setHasUnsavedChanges(true);
            setSaveStatus('unsaved');
        }
    }, [isEditable]);

    // --- CMS Update Handlers --- //
    const updateHero = (key: keyof SiteContent['hero'], value: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], hero: { ...prev[language].hero, [key]: value } }
        }));
        markAsUnsaved();
    };

    const updateStat = (index: number, key: 'value' | 'label' | 'customIcon', value: string) => {
        setContent(prev => {
            const newStats = [...prev[language].stats];
            newStats[index] = { ...newStats[index], [key]: value };
            return { ...prev, [language]: { ...prev[language], stats: newStats } };
        });
        markAsUnsaved();
    };

    const updateNav = (id: number, newLabel: string) => {
        setContent(prev => {
            const newNav = prev[language].navItems.map(item =>
                item.id === id ? { ...item, label: newLabel } : item
            );
            return { ...prev, [language]: { ...prev[language], navItems: newNav } };
        });
        markAsUnsaved();
    };

    const updateAbout = (key: keyof SiteContent['about'], value: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], about: { ...prev[language].about, [key]: value } }
        }));
        markAsUnsaved();
    };

    const updateLevelsTitle = (val: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], levels: { ...prev[language].levels, sectionTitle: val } }
        }));
        markAsUnsaved();
    };

    const updateLevelItem = (id: number, field: keyof EducationalLevel, val: string) => {
        setContent(prev => {
            const newItems = prev[language].levels.items.map(item =>
                item.id === id ? { ...item, [field]: val } : item
            );
            return {
                ...prev,
                [language]: { ...prev[language], levels: { ...prev[language].levels, items: newItems } }
            };
        });
        markAsUnsaved();
    };

    const updateRulesTitle = (val: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], rules: { ...prev[language].rules, title: val } }
        }));
        markAsUnsaved();
    };

    const updateRulesItem = (index: number, val: string) => {
        setContent(prev => {
            const newItems = [...prev[language].rules.items];
            newItems[index] = val;
            return {
                ...prev,
                [language]: { ...prev[language], rules: { ...prev[language].rules, items: newItems } }
            };
        });
        markAsUnsaved();
    };

    const updateLife = (key: keyof SiteContent['life'], value: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], life: { ...prev[language].life, [key]: value } }
        }));
        markAsUnsaved();
    };

    const updateNewsTitle = (val: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], news: { ...prev[language].news, title: val } }
        }));
        markAsUnsaved();
    };

    const updateNewsItem = (id: number, field: keyof NewsItem, val: string) => {
        setContent(prev => {
            const newItems = prev[language].news.items.map(item =>
                item.id === id ? { ...item, [field]: val } : item
            );
            return {
                ...prev,
                [language]: { ...prev[language], news: { ...prev[language].news, items: newItems } }
            };
        });
        markAsUnsaved();
    };

    const updateLessonsPage = (key: keyof SiteContent['lessonsPage'], value: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], lessonsPage: { ...prev[language].lessonsPage, [key]: value } }
        }));
        markAsUnsaved();
    };

    const updateFooter = (key: keyof SiteContent['footer'], value: string) => {
        setContent(prev => ({
            ...prev,
            [language]: { ...prev[language], footer: { ...prev[language].footer, [key]: value } }
        }));
        markAsUnsaved();
    };

    // Page Routing Logic
    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return (
                    <>
                        <Hero
                            language={language}
                            content={content[language].hero}
                            isEditable={isEditable}
                            onUpdate={updateHero}
                        />
                        <Stats
                            language={language}
                            stats={content[language].stats}
                            isEditable={isEditable}
                            onUpdate={updateStat}
                        />
                        <About
                            language={language}
                            content={content[language].about}
                            isEditable={isEditable}
                            onUpdate={updateAbout}
                        />
                    </>
                );
            case 'rules':
                return (
                    <Rules
                        content={content[language].rules}
                        isEditable={isEditable}
                        onUpdateTitle={updateRulesTitle}
                        onUpdateItem={updateRulesItem}
                    />
                );
            case 'levels':
                return (
                    <Levels
                        language={language}
                        content={content[language].levels}
                        isEditable={isEditable}
                        onUpdateTitle={updateLevelsTitle}
                        onUpdateItem={updateLevelItem}
                    />
                );
            case 'life':
                return (
                    <SchoolLife
                        language={language}
                        content={content[language].life}
                        isEditable={isEditable}
                        onUpdate={updateLife}
                    />
                );
            case 'news':
                return (
                    <News
                        language={language}
                        content={content[language].news}
                        isEditable={isEditable}
                        onUpdateTitle={updateNewsTitle}
                        onUpdateItem={updateNewsItem}
                    />
                );
            case 'lessons':
                return (
                    <LessonsPage
                        language={language}
                        content={content[language].lessonsPage}
                        materials={publicLessons.map((lesson, index) => ({
                            id: index,
                            title: lesson.title,
                            className: lesson.class_level,
                            type: lesson.type,
                            fileName: lesson.file_name || 'file.pdf',
                            date: new Date(lesson.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR'),
                            fileUrl: lesson.file_url
                        }))}
                        isEditable={isEditable}
                        onUpdate={updateLessonsPage}
                    />
                );
            case 'dashboard':
                if (currentUser === 'admin') {
                    return <AdminDashboard user={{ id: '1', email: 'admin@elfarah.ma', role: 'admin', full_name: 'المدير' }} language={language} onLogout={handleLogout} />;
                } else if (currentUser === 'teacher') {
                    return <TeacherDashboard language={language} />;
                } else if (currentUser === 'student') {
                    return <StudentDashboard language={language} />;
                } else {
                    return <div className="p-10 text-center">Unauthorized Access</div>;
                }
            default:
                return <div>Page Not Found</div>;
        }
    };

    // Get save status text and icon
    const getSaveStatusDisplay = () => {
        if (saveStatus === 'saving') {
            return {
                text: language === 'ar' ? 'جاري الحفظ...' : 'Sauvegarde...',
                icon: '⏳',
                color: 'text-yellow-200'
            };
        } else if (saveStatus === 'saved') {
            return {
                text: language === 'ar' ? 'محفوظ' : 'Sauvegardé',
                icon: '✓',
                color: 'text-green-200'
            };
        } else {
            return {
                text: language === 'ar' ? 'تعديلات غير محفوظة' : 'Non sauvegardé',
                icon: '●',
                color: 'text-orange-200'
            };
        }
    };

    const statusDisplay = getSaveStatusDisplay();

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans transition-colors duration-300">

            {isEditable && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-3 font-bold sticky top-0 z-50 shadow-lg">
                    <div className="container mx-auto px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✏️</span>
                            <span className="text-sm">
                                {language === 'ar'
                                    ? 'وضع التحرير نشط - يمكنك تعديل النصوص والصور والقوائم'
                                    : 'Mode Édition Actif - Vous pouvez modifier les textes, images et menus'
                                }
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Save Status Indicator */}
                            <div className={`flex items-center gap-2 text-sm ${statusDisplay.color}`}>
                                <span>{statusDisplay.icon}</span>
                                <span>{statusDisplay.text}</span>
                            </div>

                            {/* Manual Save Button */}
                            <button
                                onClick={handleSaveContent}
                                disabled={saveStatus === 'saving'}
                                className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                {language === 'ar' ? 'حفظ التعديلات' : 'Sauvegarder'}
                            </button>

                            {/* Dashboard Button */}
                            <button
                                onClick={() => setActivePage('dashboard')}
                                className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Header
                language={language}
                setLanguage={setLanguage}
                currentUser={currentUser}
                onLogin={handleLogin}
                onLogout={handleLogout}
                navItems={content[language].navItems}
                onUpdateNav={updateNav}
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="flex-grow animate-fade-in">
                {renderPage()}
            </main>

            <Footer
                language={language}
                content={content[language].footer}
                isEditable={isEditable}
                onUpdate={updateFooter}
            />


            <ChatWidget language={language} />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    rtl={language === 'ar'}
                />
            )}
        </div>
    );
};

export default App;
