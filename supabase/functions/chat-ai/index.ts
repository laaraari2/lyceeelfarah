
// Setup type definitions for built-in Deno.serve
// @ts-ignore
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { messages } = await req.json();
        const apiKey = Deno.env.get("OPENAI_API_KEY");

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Configuration Error: OPENAI_API_KEY is missing in Supabase Secrets" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const SYSTEM_PROMPT = `أنت المساعد الذكي لثانوية الفرح الخصوصية في الدار البيضاء، المغرب.
معلومات المؤسسة: العنوان: 3، زنقة 68، حي الأمل 2، الفداء. الهاتف: 05 22 28 36 99
المدير: الأستاذ محمد فضلي (منذ 1982). المستويات: الإعدادي والثانوي فقط.
الدخول المدرسي 2025-2026: 2-4 شتنبر تدريجياً، 8 شتنبر انطلاق الدراسة.
أجب بنفس لغة المستخدم. كن مختصراً ومفيداً.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("OpenAI API Error:", err);
            // Return the actual error from OpenAI
            return new Response(JSON.stringify(err), {
                status: response.status, // Pass the status (400, 401, etc.)
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Internal Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
