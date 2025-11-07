"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth"; // Use checkAuth instead of requireAuth

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateCoverLetter({
  companyName,
  jobTitle,
  jobDescription,
  additionalInfo,
}) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  // Create prompt for AI
  const prompt = `
    As an expert career advisor and cover letter writer, create a compelling cover letter for a ${user.industry} professional with ${user.experience} years of experience.
    
    Applicant Information:
    Name: ${user.name}
    Industry: ${user.industry}
    Experience: ${user.experience} years
    Bio: ${user.bio || "Not provided"}
    Skills: ${user.skills || "Not provided"}
    
    Job Details:
    Company: ${companyName}
    Position: ${jobTitle}
    Description: ${jobDescription}
    
    Additional Information:
    ${additionalInfo || "None provided"}
    
    Requirements:
    1. Personalize the letter for the specific company and position
    2. Highlight relevant skills and experiences
    3. Show enthusiasm for the role and company
    4. Keep it professional but personable
    5. Limit to one page (3-4 paragraphs)
    6. Include a strong opening and closing
    7. Use industry-appropriate language
    8. Format as plain text without any markdown or special formatting
    
    Structure the response as a complete cover letter without any additional explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const coverLetterContent = response.text().trim();

    // Save to database
    const coverLetter = await db.coverLetter.create({
      data: {
        userId: user.id,
        companyName,
        jobTitle,
        content: coverLetterContent,
      },
    });

    revalidatePath("/ai-cover-letter");
    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    // Provide more specific error messages based on the error type
    if (error.message.includes("API_KEY")) {
      throw new Error("AI service configuration error. Please contact support.");
    }
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}

export async function getCoverLetters() {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();

    // If not authenticated, return empty array instead of throwing
    if (!userId || !user) {
      return [];
    }

    const coverLetters = await db.coverLetter.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return coverLetters;
  } catch (error) {
    console.error("Error getting cover letters:", error);
    throw new Error("Failed to get cover letters");
  }
}

export async function getCoverLetter(id) {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();

    // If not authenticated, return null instead of throwing
    if (!userId || !user) {
      return null;
    }

    const coverLetter = await db.coverLetter.findUnique({
      where: {
        id,
        userId: user.id, // Ensure user can only access their own cover letters
      },
    });

    if (!coverLetter) {
      return null;
    }

    return coverLetter;
  } catch (error) {
    console.error("Error getting cover letter:", error);
    throw new Error("Failed to get cover letter");
  }
}

export async function updateCoverLetter(id, data) {
  try {
    // Use checkAuth instead of requireAuth
    const { user, userId } = await checkAuth();

    // If not authenticated, return early
    if (!userId || !user) {
      throw new Error("Authentication required");
    }

    // Ensure user can only update their own cover letters
    const updatedCoverLetter = await db.coverLetter.update({
      where: {
        id,
        userId: user.id,
      },
      data,
    });

    return updatedCoverLetter;
  } catch (error) {
    console.error("Error updating cover letter:", error);
    throw new Error("Failed to update cover letter");
  }
}

export async function deleteCoverLetter(id) {
  try {
    // Use checkAuth instead of requireAuth
    const { user, userId } = await checkAuth();

    // If not authenticated, return early
    if (!userId || !user) {
      throw new Error("Authentication required");
    }

    // Ensure user can only delete their own cover letters
    await db.coverLetter.delete({
      where: {
        id,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    throw new Error("Failed to delete cover letter");
  }
}