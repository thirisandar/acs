// /netlify/functions/translate.js

const { GoogleGenAI } = require("@google/genai");

// The Gemini API key is loaded automatically from Netlify's environment variables
// This keeps the key secret!
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { text } = JSON.parse(event.body);

        if (!text) {
            return { statusCode: 400, body: "Missing 'text' in request body" };
        }

        // --- Core Gemini API Call for Translation ---
        const prompt = `Translate the following Burmese text to a concise, professional English image generation prompt. The final output must only be the English translation and nothing else. Burmese Text: "${text}"`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Fast and capable model
            contents: prompt,
        });

        const translatedText = response.text.trim();

        return {
            statusCode: 200,
            body: JSON.stringify({ translatedText }),
        };

    } catch (error) {
        console.error("Gemini Translation Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Translation service failed." }),
        };
    }
};