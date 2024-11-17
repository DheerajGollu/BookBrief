import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyBKVJXJ111S-ZVWGx0dDYEz7mCvJfWqdLg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Provide a short summary of '" + {bookname} + "' book and provide a list of 5 similar books.";

const result = await model.generateContent(prompt);
console.log(result.response.text());