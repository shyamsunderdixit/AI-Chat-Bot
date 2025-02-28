
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDAYRxiR8cbBjOsd2xd0AZj7j3jGwBEr3s";
const genAI = new GoogleGenerativeAI(apiKey);

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
