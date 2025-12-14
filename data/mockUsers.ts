import { AuthUser } from '../services/authService';

export interface MockUser extends AuthUser {
    password?: string;
    subjects?: string[]; // For teachers
    student_code?: string; // For students
    class_level?: string; // For students
    birth_date?: string; // For students
}

export const MOCK_USERS: MockUser[] = [
    // --- ADMIN ---
    {
        id: 'admin-123',
        email: 'admin@elfarah.ma',
        password: 'admin',
        role: 'admin',
        full_name: 'المدير العام',
        phone: '0522283699'
    },

    // --- STUDENTS ---
    {
        id: 'student-1',
        email: 'student@elfarah.ma',
        password: 'student',
        role: 'student',
        full_name: 'التلميذ المجتهد',
        student_code: 'STD2024001',
        class_level: '2ème Bac PC',
        birth_date: '2006-05-20'
    },

    // --- TEACHERS: ARABIC ---
    {
        id: '1',
        email: 'labit@elfarah.ma',
        password: 'labit',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Labit',
        subjects: ['اللغة العربية']
    },
    {
        id: '2',
        email: 'jalil@elfarah.ma',
        password: 'jalil',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Jalil',
        subjects: ['اللغة العربية']
    },

    // --- TEACHERS: FRENCH ---
    {
        id: '3',
        email: 'khalid@elfarah.ma',
        password: 'khalid',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Khalid',
        subjects: ['اللغة الفرنسية']
    },
    {
        id: '4',
        email: 'aassri@elfarah.ma',
        password: 'aassri',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Aassri',
        subjects: ['اللغة الفرنسية']
    },

    // --- TEACHERS: ENGLISH ---
    {
        id: '5',
        email: 'anagri@elfarah.ma',
        password: 'anagri',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Anagri',
        subjects: ['اللغة الإنجليزية']
    },
    {
        id: '6',
        email: 'joudar@elfarah.ma',
        password: 'joudar',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Joudar',
        subjects: ['اللغة الإنجليزية']
    },

    // --- TEACHERS: MATH ---
    {
        id: '7',
        email: 'edrissi@elfarah.ma',
        password: 'edrissi',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Edrissi',
        subjects: ['الرياضيات']
    },
    {
        id: '8',
        email: 'agnaw@elfarah.ma',
        password: 'agnaw',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Agnaw',
        subjects: ['الرياضيات']
    },

    // --- TEACHERS: SVT ---
    {
        id: '9',
        email: 'banani@elfarah.ma',
        password: 'banani',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Banani',
        subjects: ['علوم الحياة والأرض']
    },
    {
        id: '10',
        email: 'assmaa@elfarah.ma',
        password: 'assmaa',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Assmaa',
        subjects: ['علوم الحياة والأرض']
    },

    // --- TEACHERS: PHYSICS (PC) ---
    {
        id: '11',
        email: 'hajami@elfarah.ma',
        password: 'hajami',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Hajami',
        subjects: ['الفيزياء والكيمياء']
    },
    {
        id: '12',
        email: 'majda@elfarah.ma',
        password: 'majda',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Majda',
        subjects: ['الفيزياء والكيمياء']
    },

    // --- TEACHERS: HISTORY & GEO (HG) ---
    {
        id: '13',
        email: 'fattallah@elfarah.ma',
        password: 'fattallah',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Fattallah',
        subjects: ['التاريخ والجغرافيا']
    },

    // --- TEACHERS: ISLAMIC EDU (EI) ---
    {
        id: '14',
        email: 'benaabid@elfarah.ma',
        password: 'benaabid',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Benaabid',
        subjects: ['التربية الإسلامية']
    },
    {
        id: '15',
        email: 'farhatti@elfarah.ma',
        password: 'farhatti',
        role: 'teacher',
        full_name: 'الأستاذ(ة) Farhatti',
        subjects: ['التربية الإسلامية']
    }
];
