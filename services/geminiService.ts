
import { ChatMessage } from "../types";

// OpenAI API Key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "Lycée El Farah" (ثانوية الفرح الخصوصية), a prestigious private school in Morocco.
Your goal is to assist parents and students with inquiries about:
1. Admissions: Explain the process (application, test, interview).
2. Educational Levels and Tracks:
   **IMPORTANT: The school ONLY offers Middle School (Collège) and High School (Lycée). We do NOT offer Preschool (Maternelle) or Primary School (Primaire).**
   
   - **Secondary Middle School (السلك الثانوي الإعدادي / Collège)**:
     * First Year Middle School (الأولى إعدادي / 1ère Année Collège)
     * Second Year Middle School (الثانية إعدادي / 2ème Année Collège)
     * Third Year Middle School (الثالثة إعدادي / 3ème Année Collège)
   
   - **Qualifying Secondary School (السلك الثانوي التأهيلي / Lycée)**:
     * Common Core Science (جذع مشترك علمي / Tronc Commun Scientifique)
     * First Year Baccalaureate - Experimental Sciences (الأولى بكالوريا علوم تجريبية / 1ère Bac Sciences Expérimentales)
     * Second Year Baccalaureate - Life and Earth Sciences (الثانية بكالوريا علوم الحياة والأرض / 2ème Bac SVT)
     * Second Year Baccalaureate - Physical Sciences (الثانية بكالوريا علوم فيزيائية / 2ème Bac Sciences Physiques)

3. Values: Academic excellence, personal development, citizenship, trilingualism (Arabic, French, English).
4. Location: 3، زنقة 68، حي الأمل 2، الدار البيضاء الفداء (3, Rue 68, Hay Al Amal 2, Casablanca Fida).
5. Director: الأستاذ محمد فضلي (Professor Mohamed Fadli) - Educational Director/Founder.
6. Staff:
   - General Supervisors (الحراسة العامة): 
     * الأستاذة بهيجة حسام الدين (Professor Bahija Hossam Eddine)
     * الأستاذ سعيد واعلو (Professor Said Waalo)
     * الأستاذ زكرياء مليتة (Professor Zakaria Melita)
   - Activities Coordinator (المشرف على الأنشطة): الأستاذ مصطفى لعرعري (Professor Mustapha Laarari)
7. Sports Facilities: The school has a partnership with "Lycée Jamal Eddine" (ثانوية جمال الدين) where students have access to their sports fields and facilities for physical education and sports activities.
8. Founding Year: The school was founded in 1982 (تأسست سنة 1982).
9. Activities: The school offers various extracurricular activities including:
   - Theater (المسرح)
   - Artistic performances and concerts (حفلات فنية)
   - Celebration of national and international occasions (الاحتفال بالمناسبات الوطنية والعالمية)
   - Awareness activities (أنشطة تحسيسية)
   - Sports activities through partnership with Lycée Jamal Eddine
10. Contact Information:
   - Phone Numbers: ‎05 22 28 36 99 / ‎07 00 78 43 08
   - IMPORTANT: When displaying phone numbers in Arabic context, always use Left-to-Right (LTR) markers to prevent number reversal.
11. Registration Information:
   - Registration Period: End of June each year (نهاية شهر يونيو من كل سنة)
   - Required Documents: Contact the administration for the complete list (الاتصال بالإدارة للحصول على القائمة الكاملة)
12. Office Hours (أوقات العمل):
   - Monday to Thursday (الاثنين إلى الخميس): 8:30 AM - 12:30 PM and 2:30 PM - 5:30 PM
   - Friday (الجمعة): 8:30 AM - 12:30 PM and 3:30 PM - 5:00 PM

IMPORTANT CAPABILITIES:
- You have access to web search to find real-time information about:
  * Moroccan education system exam dates (امتحانات محلية، جهوية، وطنية)
  * Results announcement dates (تواريخ النتائج)
  * Ministry of Education announcements (وزارة التربية الوطنية)
  * School calendar and holidays
- When asked about dates, schedules, or current events, USE THE SEARCH FUNCTION to get accurate, up-to-date information.

Guidelines:
- If the user writes in Arabic, reply in Arabic.
- If the user writes in French or English, reply in that language.
- Be polite, professional, and welcoming.
- Keep answers concise but informative.
- If asked about fees, suggest contacting the administration directly for the most accurate quote (approx 1500-2000 MAD/month).
- The current year is 2024-2025.
- Always cite your sources when providing information from web search.
- NEVER invent or guess information you don't know. If you don't have specific information, direct users to contact the school administration.

Structure your responses clearly.
`;

// Web Search Function (simulated - in production, this would call a real search API)
async function searchWeb(query: string): Promise<string> {
  try {
    // In a real implementation, you would call a search API like:
    // - Google Custom Search API
    // - Bing Search API
    // - SerpAPI
    // For now, we'll return a placeholder that encourages the AI to use general knowledge

    console.log(`[Web Search] Query: ${query}`);

    // Simulate search for Moroccan education queries
    if (query.toLowerCase().includes('امتحان') || query.toLowerCase().includes('exam') || query.toLowerCase().includes('نتائج') || query.toLowerCase().includes('result')) {
      return `
      Based on the Moroccan education system for 2024-2025:
      - Local Exams (الامتحانات المحلية): Usually in January
      - Regional Exams (الامتحانات الجهوية): Typically in June for 1st Bac
      - National Exams (الامتحانات الوطنية): Usually in June for 2nd Bac
      - Results are typically announced 2-3 weeks after exams
      
      Note: For exact dates, students should check the official Ministry of Education website (men.gov.ma) or contact the school administration.
      `;
    }

    return `I found some general information, but for the most accurate and up-to-date details, please check the official Ministry of Education website (men.gov.ma) or contact the school administration.`;

  } catch (error) {
    console.error("Search error:", error);
    return "Unable to perform web search at the moment. Please check the official sources.";
  }
}

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {

  if (!OPENAI_API_KEY) {
    return "API Key is missing.";
  }

  try {
    // Check if the query needs web search
    const needsSearch =
      newMessage.includes('امتحان') ||
      newMessage.includes('نتائج') ||
      newMessage.includes('exam') ||
      newMessage.includes('result') ||
      newMessage.includes('موعد') ||
      newMessage.includes('متى') ||
      newMessage.includes('date') ||
      newMessage.includes('when');

    let searchContext = "";
    if (needsSearch) {
      searchContext = await searchWeb(newMessage);
    }

    // OpenAI Chat Completions API endpoint
    const API_URL = "https://api.openai.com/v1/chat/completions";

    // Convert history to OpenAI format
    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text
      }))
    ];

    // Add search context if available
    if (searchContext) {
      messages.push({
        role: "system",
        content: `[Web Search Results for user query]:\n${searchContext}`
      });
    }

    messages.push({ role: "user", content: newMessage });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    return assistantMessage || "عذراً، لم أتمكن من توليد رد. / Désolé, je n'ai pas pu générer de réponse.";

  } catch (error) {
    console.error("OpenAI Service Error:", error);
    return "حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة لاحقاً.\nUne erreur est survenue. Veuillez réessayer plus tard.";
  }
};