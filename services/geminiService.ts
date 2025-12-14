
import { ChatMessage } from "../types";
import { supabase } from "../lib/supabase";

const SYSTEM_PROMPT = `أنت المساعد الذكي لثانوية الفرح الخصوصية في الدار البيضاء، المغرب.
معلومات المؤسسة: العنوان: 3، زنقة 68، حي الأمل 2، الفداء. الهاتف: 05 22 28 36 99
المدير: الأستاذ محمد فضلي (منذ 1982). المستويات: الإعدادي والثانوي فقط.
الدخول المدرسي 2025-2026: 2-4 شتنبر تدريجياً، 8 شتنبر انطلاق الدراسة.
أجب بنفس لغة المستخدم. كن مختصراً ومفيداً.`;

// Comprehensive local responses for fallback (offline / error)
const RESPONSES: { [key: string]: { ar: string; fr: string } } = {
  greeting: {
    ar: "مرحباً بك في ثانوية الفرح الخصوصية! 👋\n\nأنا مساعدك الذكي. يمكنني مساعدتك في:\n• التسجيل والوثائق 📋\n• المستويات الدراسية 📚\n• الامتحانات والمواعيد 📅\n• العنوان والاتصال 📞\n\nكيف يمكنني خدمتك؟",
    fr: "Bienvenue au Lycée El Farah! 👋\n\nJe peux vous aider avec:\n• Inscription 📋\n• Niveaux 📚\n• Examens 📅\n• Contact 📞"
  },
  admission: {
    ar: "📋 **التسجيل:**\n\n**الفترة:** نهاية يونيو\n\n**الوثائق:**\n• شهادة مدرسية\n• عقد الازدياد\n• صور شمسية\n\n📞 05 22 28 36 99\n📞 07 00 78 43 08",
    fr: "📋 **Inscription:** Fin juin\n\n📞 05 22 28 36 99"
  },
  levels: {
    ar: "📚 **المستويات:**\n\n**الإعدادي:** الأولى، الثانية، الثالثة\n\n**الثانوي:** جذع مشترك، أولى باك، ثانية باك SVT/PC\n\n⚠️ لا نوفر الابتدائي",
    fr: "📚 **Niveaux:** Collège (1ère-3ème) + Lycée (TC, 1ère, 2ème Bac)"
  },
  location: {
    ar: "📍 **العنوان:**\n3، زنقة 68، حي الأمل 2\nالدار البيضاء - الفداء\n\n📞 05 22 28 36 99\n📞 07 00 78 43 08\n\n🕐 الاثنين-الجمعة: 8:30-17:30",
    fr: "📍 3, Rue 68, Hay Al Amal 2, Fida\n📞 05 22 28 36 99"
  },
  calendar: {
    ar: "📅 **الدخول المدرسي 2025-2026:**\n\n• الثلاثاء 2 شتنبر: الأولى إعدادي، الجذع المشترك\n• الأربعاء 3 شتنبر: الثانية إعدادي، الأولى باك\n• الخميس 4 شتنبر: الثالثة إعدادي، الثانية باك\n• الاثنين 8 شتنبر: انطلاق الدراسة الفعلي\n\n📅 **نهاية الدراسة:**\n• الثانية باك: 30 ماي 2026\n• باقي المستويات: 30 يونيو 2026",
    fr: "📅 **Rentrée 2025-2026:**\n• 2-4 Sept: Rentrée progressive\n• 8 Sept: Début effectif"
  },
  exams: {
    ar: "📝 **الامتحانات:**\n\n• الموحد المحلي: يناير\n• الموحد الجهوي: يونيو\n• الباكالوريا الوطنية: يونيو\n\n📱 النتائج: men.gov.ma",
    fr: "📝 **Examens:** Local (Jan), Régional (Juin), Bac (Juin)"
  },
  bac: {
    ar: "🎓 **الباكالوريا:**\n\n**المسالك:** SVT، العلوم الفيزيائية\n\n**المعاملات:**\n• الرياضيات: 7-9\n• الفيزياء: 5-7\n\n📅 الامتحان: يونيو\n📱 bac.men.gov.ma",
    fr: "🎓 **Bac:** SVT, PC | Examen: Juin"
  },
  tips: {
    ar: "💡 **نصائح للنجاح:**\n\n📚 راجع يومياً\n✏️ أنجز التمارين\n😴 نم 7-8 ساعات\n🍳 فطور صحي\n🎯 ابدأ المراجعة مبكراً\n\n**بالتوفيق! 🌟**",
    fr: "💡 **Conseils:** Révisez quotidiennement, dormez bien, petit-déj équilibré"
  },
  director: {
    ar: "👤 **الإدارة:**\n\n**المدير:** الأستاذ محمد فضلي (منذ 1982)\n\n**الحراسة:**\n• الأستاذة بهيجة حسام الدين\n• الأستاذ سعيد واعلو\n• الأستاذ زكرياء مليتة",
    fr: "👤 **Direction:** Prof. Mohamed Fadli (depuis 1982)"
  },
  thanks: {
    ar: "على الرحب والسعة! 😊\n\nهل هناك شيء آخر؟\n📞 05 22 28 36 99",
    fr: "De rien! 😊\n📞 05 22 28 36 99"
  },
  default: {
    ar: "شكراً لتواصلك! 😊\n\n**اكتب:**\n• تسجيل\n• مستويات\n• عنوان\n• دخول مدرسي\n• باكالوريا\n• نصائح\n\n📞 05 22 28 36 99",
    fr: "Tapez: inscription, niveaux, adresse\n📞 05 22 28 36 99"
  }
};

const detectLang = (text: string): 'ar' | 'fr' => /[\u0600-\u06FF]/.test(text) ? 'ar' : 'fr';

const getLocalResponse = (message: string): string => {
  const m = message.toLowerCase();
  const lang = detectLang(message);

  if (m.match(/مرحبا|السلام|اهلا|سلام|صباح|مساء|bonjour|hello|hi|salut/i)) return RESPONSES.greeting[lang];
  if (m.match(/تسجيل|inscription|وثائق|documents/i)) return RESPONSES.admission[lang];
  if (m.match(/مستوى|مستويات|niveau|قسم|أقسام/i)) return RESPONSES.levels[lang];
  if (m.match(/عنوان|فين|أين|توجد|مكان|كاين|كاينة|هاتف|اتصال|adresse|contact|رقم|lieu|where|location/i)) return RESPONSES.location[lang];
  if (m.match(/دخول|عطل|2025|2026|مقرر|تقويم|rentrée|calendrier/i)) return RESPONSES.calendar[lang];
  if (m.match(/امتحان|فرض|نتيجة|نتائج|موحد|examen/i)) return RESPONSES.exams[lang];
  if (m.match(/باكالوريا|البكالوريا|باك|الباك|bac/i)) return RESPONSES.bac[lang];
  if (m.match(/نصيحة|نصائح|كيف|كيفاش|نجاح|conseil/i)) return RESPONSES.tips[lang];
  if (m.match(/مدير|ادارة|directeur/i)) return RESPONSES.director[lang];
  if (m.match(/شكر|merci|thank/i)) return RESPONSES.thanks[lang];

  return RESPONSES.default[lang];
};

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {

  try {
    // 1. Try to call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('chat-ai', {
      body: {
        messages: history.slice(-6).map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text
        })).concat([{ role: 'user', content: newMessage }])
      }
    });

    if (error) {
      console.warn("Edge Function Error (Verification):", error);
      throw error;
    }

    if (data?.reply) {
      return data.reply;
    }

    // Fallback if data is empty
    return getLocalResponse(newMessage);

  } catch (error) {
    // 2. Fallback to Local Response if API/Network fails
    console.log("Falling back to local response system...");
    return getLocalResponse(newMessage);
  }
};