import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCQhsFVnEVAdFc1UcHr-9TpXw2kE6tVASY"; // Replace with your key
const genAI = new GoogleGenerativeAI(apiKey);

export const getAIResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble responding right now.";
  }
};
