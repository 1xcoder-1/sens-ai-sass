"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth"; // Use checkAuth instead of requireAuth

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Create roadmap using AI
export async function createRoadmap(careerField) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  const prompt = `
    As an expert career advisor, create a comprehensive career roadmap for someone in the field of "${careerField}".
    
    User Profile:
    Industry: ${user.industry || "Not specified"}
    Experience: ${user.experience || "Not specified"} years
    Skills: ${user.skills ? user.skills.join(", ") : "Not specified"}
    
    Requirements:
    1. Create a detailed roadmap with 5-7 major phases
    2. Each phase should have:
       - A clear title (e.g., "Foundational Skills")
       - A brief description of what to focus on
       - Estimated duration (e.g., "3-6 months")
       - Key milestones or deliverables
    3. Personalize the roadmap based on the user's industry, experience, and skills
    4. Include both technical and soft skill development
    5. Consider current industry trends and future outlook
    6. Format the response as JSON with the following structure:
       {
         "title": "Career Roadmap for [Field]",
         "description": "A comprehensive guide to building a career in [Field]",
         "steps": [
           {
             "id": 1,
             "title": "Phase Title",
             "description": "What to focus on in this phase",
             "duration": "Estimated time frame",
             "status": "pending"
           }
         ]
       }
    7. Do not include any additional text, explanations, or markdown formatting
    8. Make sure the roadmap is realistic and actionable
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const roadmapContent = response.text().trim();

    // Parse the JSON response
    let parsedContent;
    try {
      // Remove any markdown code block formatting if present
      const cleanedContent = roadmapContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Return a default roadmap structure if parsing fails
      parsedContent = {
        title: `Career Roadmap for ${careerField}`,
        description: `A comprehensive guide to building a career in ${careerField}`,
        steps: [
          {
            id: 1,
            title: "Research and Planning",
            description: "Research the field, required skills, and create a learning plan",
            duration: "1-2 months",
            status: "pending"
          },
          {
            id: 2,
            title: "Foundational Skills",
            description: "Learn the core skills and concepts needed for this field",
            duration: "3-6 months",
            status: "pending"
          },
          {
            id: 3,
            title: "Practical Experience",
            description: "Gain hands-on experience through projects, internships, or volunteering",
            duration: "3-6 months",
            status: "pending"
          },
          {
            id: 4,
            title: "Networking and Branding",
            description: "Build professional network and establish personal brand",
            duration: "Ongoing",
            status: "pending"
          },
          {
            id: 5,
            title: "Job Search and Application",
            description: "Prepare for interviews and apply for positions",
            duration: "1-3 months",
            status: "pending"
          }
        ]
      };
    }

    return parsedContent;
  } catch (error) {
    console.error("Error creating roadmap:", error);
    // Return a default roadmap structure if AI generation fails
    return {
      title: `Career Roadmap for ${careerField}`,
      description: `A comprehensive guide to building a career in ${careerField}`,
      steps: [
        {
          id: 1,
          title: "Research and Planning",
          description: "Research the field, required skills, and create a learning plan",
          duration: "1-2 months",
          status: "pending"
        },
        {
          id: 2,
          title: "Foundational Skills",
          description: "Learn the core skills and concepts needed for this field",
          duration: "3-6 months",
          status: "pending"
        },
        {
          id: 3,
          title: "Practical Experience",
          description: "Gain hands-on experience through projects, internships, or volunteering",
          duration: "3-6 months",
          status: "pending"
        },
        {
          id: 4,
          title: "Networking and Branding",
          description: "Build professional network and establish personal brand",
          duration: "Ongoing",
          status: "pending"
        },
        {
          id: 5,
          title: "Job Search and Application",
          description: "Prepare for interviews and apply for positions",
          duration: "1-3 months",
          status: "pending"
        }
      ]
    };
  }
}

// Save roadmap to database
export async function saveRoadmap(roadmapData) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  try {
    // Check if the roadmap model exists in the database
    if (!db || !db.roadmap) {
      throw new Error("Roadmap model not available in database");
    }

    // Always create a new roadmap instead of updating existing one
    const savedRoadmap = await db.roadmap.create({
      data: {
        userId: user.id,
        title: roadmapData.title,
        description: roadmapData.description,
        steps: roadmapData.steps,
        progress: roadmapData.progress || {},
      },
    });

    revalidatePath("/roadmap");
    return savedRoadmap;
  } catch (error) {
    console.error("Error saving roadmap:", error);
    throw new Error("Failed to save roadmap");
  }
}

// Update roadmap progress
export async function updateRoadmapProgress(roadmapId, progress) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  try {
    // Check if the roadmap model exists in the database
    if (!db || !db.roadmap) {
      throw new Error("Roadmap model not available in database");
    }

    const updatedRoadmap = await db.roadmap.update({
      where: {
        id: roadmapId,
        userId: user.id, // Ensure the roadmap belongs to the current user
      },
      data: {
        progress: progress,
      },
    });

    revalidatePath("/roadmap");
    return updatedRoadmap;
  } catch (error) {
    console.error("Error updating roadmap progress:", error);
    throw new Error("Failed to update roadmap progress");
  }
}

// Get user's roadmap from database
export async function getUserRoadmap() {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();

    // If not authenticated, return null instead of throwing
    if (!userId || !user) {
      return null;
    }

    // Check if the roadmap model exists in the database
    if (!db || !db.roadmap) {
      return null;
    }

    const roadmap = await db.roadmap.findUnique({
      where: {
        userId: user.id,
      },
    });

    return roadmap;
  } catch (error) {
    console.error("Error getting roadmap:", error);
    return null;
  }
}

// Get all roadmaps for the user (for displaying previous roadmaps)
export async function getUserRoadmaps() {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();
    
    // If not authenticated, return empty array instead of throwing
    if (!userId || !user) {
      return [];
    }

    // Check if the roadmap model exists in the database
    if (!db || !db.roadmap) {
      console.error("Roadmap model not available in database");
      return [];
    }

    // Get all roadmaps for this user, ordered by creation date
    const roadmaps = await db.roadmap.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return roadmaps;
  } catch (error) {
    console.error("Error getting roadmaps:", error);
    // Return empty array as fallback
    return [];
  }
}

// Get a specific roadmap by ID
export async function getRoadmapById(roadmapId) {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();

    // If not authenticated, return null instead of throwing
    if (!userId || !user) {
      return null;
    }

    try {
      // Check if the roadmap model exists in the database
      if (!db || !db.roadmap) {
        return null;
      }

      const roadmap = await db.roadmap.findUnique({
        where: {
          id: roadmapId,
          userId: user.id, // Ensure the roadmap belongs to the current user
        },
      });

      return roadmap;
    } catch (error) {
      console.error("Error getting roadmap:", error);
      return null;
    }
  } catch (error) {
    console.error("Error in getRoadmapById:", error);
    return null;
  }
}

// Delete a roadmap by ID
export async function deleteRoadmap(roadmapId) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  try {
    // Check if the roadmap model exists in the database
    if (!db || !db.roadmap) {
      throw new Error("Roadmap model not available in database");
    }

    // First check if the roadmap exists and belongs to the current user
    const existingRoadmap = await db.roadmap.findUnique({
      where: {
        id: roadmapId,
        userId: user.id,
      },
    });

    // If roadmap doesn't exist or doesn't belong to the user, throw a specific error
    if (!existingRoadmap) {
      throw new Error("Roadmap not found or you don't have permission to delete it");
    }

    // Delete the roadmap
    const deletedRoadmap = await db.roadmap.delete({
      where: {
        id: roadmapId,
        userId: user.id, // Ensure the roadmap belongs to the current user
      },
    });

    revalidatePath("/roadmap");
    return deletedRoadmap;
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    // Handle the specific Prisma error for record not found
    if (error.code === 'P2025') {
      throw new Error("Roadmap not found or you don't have permission to delete it");
    }
    throw new Error("Failed to delete roadmap");
  }
}