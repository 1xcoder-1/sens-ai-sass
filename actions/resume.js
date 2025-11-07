"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth"; // Use checkAuth instead of requireAuth

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function saveResume(content) {
  try {
    // Use checkAuth instead of requireAuth
    const { user, userId } = await checkAuth();

    // If not authenticated, return early
    if (!userId || !user) {
      throw new Error("Authentication required");
    }

    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    // Provide more specific error messages
    if (error.message.includes('database')) {
      throw new Error("Database connection failed. Please try again later.");
    }
    throw new Error("Failed to save resume: " + error.message);
  }
}

export async function getResume() {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();

    // If not authenticated, return null instead of throwing
    if (!userId || !user) {
      return null;
    }

    return await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Error getting resume:", error);
    // Provide more specific error messages
    if (error.message.includes('database')) {
      throw new Error("Database connection failed. Please try again later.");
    }
    return null;
  }
}

export async function improveWithAI({ current, type }) {
  try {
    // Use checkAuth for AI improvements
    const { user, userId } = await checkAuth();

    // If not authenticated, return early
    if (!userId || !user) {
      throw new Error("Authentication required");
    }

    // Customize prompt based on type
    let prompt;
    if (type === "skills") {
      prompt = `
        As an expert career advisor, generate a list of relevant technical skills based on the following topic: "${current}"
        
        Requirements:
        1. Only return skill names, separated by commas
        2. Focus on technical skills, tools, and technologies
        3. Include both foundational and advanced skills
        4. Prioritize in-demand skills in this field
        5. Do not include explanations or descriptions
        6. Do not include project names or general terms
        7. Format as a single line of comma-separated values
        
        Example response for "python data science":
        Python, NumPy, Pandas, Scikit-learn, Matplotlib, Seaborn, Jupyter, TensorFlow, PyTorch, SQL, Flask, Django, Data Analysis, Machine Learning, Statistical Modeling
      `;
    } else {
      prompt = `
        As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
        Make it more impactful, quantifiable, and aligned with industry standards.
        Current content: "${current}"

        Requirements:
        1. Use action verbs
        2. Include metrics and results where possible
        3. Highlight relevant technical skills
        4. Keep it concise but detailed
        5. Focus on achievements over responsibilities
        6. Use industry-specific keywords
        
        Format the response as a single paragraph without any additional text or explanations.
      `;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    // Provide more specific error messages
    if (error.message.includes('API_KEY')) {
      throw new Error("AI service configuration error. Please contact support.");
    }
    throw new Error("Failed to improve content: " + error.message);
  }
}