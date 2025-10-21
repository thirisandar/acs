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
        const { text_to_translate } = JSON.parse(event.body);

        if (!text_to_translate) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing text_to_translate field.' }) };
        }
        
        // Define the prompt to tell Gemini exactly what you want
        const systemInstruction = "You are an expert, context-aware translation engine. Your task is to translate the user-provided text from Burmese (my) to professional English (en) for English complete prompt . Preserve all technical terms and translate the overall creative intent accurately. ONLY return the translated text.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // A fast, capable model for translation
            contents: text_to_translate,
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
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server translation failed.', details: error.message }),
        };
    }
};