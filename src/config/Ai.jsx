import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

// console.log("Gemini API Key:", import.meta.env.VITE_GEMINI_API_KEY);

export const getAIResponse = async (message) => {
  try {
    // Using Gemini 2.0 Flash for faster response times
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    
    const result = await model.generateContent({
      contents: [{ parts: [{ text: message }] }],
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble responding right now.";
  }
};
