// netlify/functions/gemini-translate.js
const { GoogleGenAI } = require('@google/genai');

// The Gemini client will automatically pick up the GEMINI_API_KEY 
// from your Netlify Environment Variables.
const ai = new GoogleGenAI({}); 

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // *** CRITICAL FIX: Change from text_to_translate to prompt ***
        // This must match the key sent by the client (text-prompt.js)
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            // Updated error message to match the new key name
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required field: prompt.' }) };
        }
        
        // Define the prompt to tell Gemini exactly what you want
        const systemInstruction = "You are an expert, context-aware translation engine. Your task is to translate the user-provided text from Burmese (my) to professional English (en) for English complete prompt. Preserve all technical terms and translate the overall creative intent accurately. ONLY return the translated text and nothing else.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // A fast, capable model for translation
            // *** FIX: Pass the user content as an array of parts ***
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                systemInstruction: systemInstruction,
            },
        });

        // Extract the translated text
        const final_prompt_en = response.text.trim();

        // Return the English prompt securely
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ final_prompt_en: final_prompt_en }),
        };

    } catch (error) {
        console.error("Gemini Translation Error:", error.message);
        // This robust 500 error will be caught by the client-side code
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server translation failed.', details: error.message }),
        };
    }
};