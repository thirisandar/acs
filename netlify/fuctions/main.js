// netlify/functions/main.js
const { GoogleGenAI } = require('@google/genai');

// The Gemini client automatically uses the GEMINI_API_KEY from Netlify Environment Variables.
const ai = new GoogleGenAI({}); 

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // *** 1. CRITICAL FIX: Extract the 'prompt' key to match client (text-prompt.js) ***
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            // Return a 400 Bad Request error if the input is missing
            return { 
                statusCode: 400, 
                body: JSON.stringify({ error: 'Missing required field: prompt.' }) 
            };
        }
        
        // Define the prompt to tell Gemini exactly what you want
        const systemInstruction = "You are an expert, context-aware translation engine. Your task is to translate the user-provided text from Burmese (my) to professional English (en) for English complete prompt. Preserve all technical terms and translate the overall creative intent accurately. ONLY return the translated text and nothing else.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Fast and efficient for translation tasks
            
            // *** 2. FIX: Use the standard API content structure ***
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                systemInstruction: systemInstruction,
            },
        });

        // Extract the translated text
        const final_prompt_en = response.text.trim();

        // Return the final result to the client
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ final_prompt_en: final_prompt_en }),
        };

    } catch (error) {
        console.error("Gemini Translation Error:", error.message);
        // Return a robust 500 Internal Server Error with details for client debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server translation failed.', details: error.message }),
        };
    }
};  