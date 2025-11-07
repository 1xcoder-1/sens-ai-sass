"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAuth } from "@/lib/auth"; // Use checkAuth instead of requireAuth

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateAssessment({ topic, difficulty, questionCount }) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  // Create prompt for AI, using user's industry and experience for personalization
  const userIndustry = user.industry || "technology";
  const userExperience = user.experience || "intermediate";
  const userSkills = user.skills ? user.skills.join(", ") : "general skills";
  
  const prompt = `
    As an expert interviewer and career advisor, generate a technical assessment for a ${userIndustry} professional with ${userExperience} years of experience.
    
    Assessment Details:
    Topic: ${topic}
    Difficulty: ${difficulty}
    Number of Questions: ${questionCount}
    
    User Profile:
    Industry: ${userIndustry}
    Experience: ${userExperience} years
    Skills: ${userSkills}
    
    Requirements:
    1. Generate exactly ${questionCount} multiple choice questions
    2. Include a mix of question types (technical, behavioral, situational)
    3. Tailor questions to ${difficulty} difficulty level
    4. Focus on ${topic} within the context of ${userIndustry}
    5. For each question, provide:
       - The question text
       - Four answer options (A, B, C, D)
       - The correct answer (one of A, B, C, or D)
       - An explanation for the correct answer
       - Difficulty rating (1-5)
       - Estimated time to answer (in minutes)
       - Key skills being assessed
    6. Format the response as JSON with the following structure:
       {
         "questions": [
           {
             "question": "Question text",
             "options": ["Option A", "Option B", "Option C", "Option D"],
             "correctAnswer": "A", // or B, C, D
             "explanation": "Explanation of why the correct answer is right",
             "difficulty": 1-5,
             "timeToAnswer": "minutes",
             "skills": ["skill1", "skill2"]
           }
         ]
       }
    7. Do not include any additional text, explanations, or markdown formatting
    8. Make sure each question has exactly one correct answer
    9. Ensure the options are plausible but only one is correct
    10. Focus questions on the user's industry and skills when relevant
  `;

  try {
    // Attempt to generate content with retry logic for 503 errors
    let result;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        result = await model.generateContent(prompt);
        break; // Success, exit the loop
      } catch (error) {
        attempts++;
        // If it's a 503 error and we haven't exceeded max attempts, wait and retry
        if (error.status === 503 && attempts < maxAttempts) {
          // Wait for 2 seconds before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
          continue;
        }
        // If it's not a 503 error or we've exceeded max attempts, re-throw
        throw error;
      }
    }
    
    const response = result.response;
    const assessmentContent = response.text().trim();

    // Parse the JSON response
    let parsedContent;
    try {
      // Remove any markdown code block formatting if present
      const cleanedContent = assessmentContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      throw new Error("Failed to parse assessment content");
    }

    // Save to database
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        // Set initial quizScore to 0 since the assessment hasn't been completed yet
        quizScore: 0,
        // Set the category based on the topic
        category: topic,
        questions: parsedContent.questions, // Store questions as JSON array
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error generating assessment:", error);
    
    // Provide more specific error messages based on the error type
    if (error.status === 503) {
      throw new Error("The AI service is currently overloaded. Please try again in a few moments.");
    } else if (error.message.includes("API_KEY")) {
      throw new Error("AI service configuration error. Please contact support.");
    } else if (error.message.includes("parse")) {
      throw new Error("Failed to process AI response. Please try again.");
    }
    
    throw new Error("Failed to generate assessment. Please try again.");
  }
}

export async function getAssessments() {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();

    // If not authenticated, return empty array instead of throwing
    if (!userId || !user) {
      return [];
    }

    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error getting assessments:", error);
    throw new Error("Failed to get assessments");
  }
}

export async function getAssessment(id) {
  try {
    // Use checkAuth instead of requireAuth to prevent dynamic server usage
    const { user, userId } = await checkAuth();

    // If not authenticated, return null instead of throwing
    if (!userId || !user) {
      return null;
    }

    const assessment = await db.assessment.findUnique({
      where: {
        id,
        userId: user.id, // Ensure user can only access their own assessments
      },
    });

    if (!assessment) {
      return null;
    }

    return assessment;
  } catch (error) {
    console.error("Error getting assessment:", error);
    throw new Error("Failed to get assessment");
  }
}

export async function submitAssessmentAnswers(assessmentId, answers) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  try {
    // First, get the assessment to ensure it belongs to the user
    const assessment = await db.assessment.findUnique({
      where: {
        id: assessmentId,
        userId: user.id,
      },
    });

    if (!assessment) {
      throw new Error("Assessment not found");
    }

    // Calculate score based on answers
    let correctAnswers = 0;
    const totalQuestions = assessment.questions.length;

    // Calculate actual score based on correct answers
    for (let i = 0; i < totalQuestions; i++) {
      const question = assessment.questions[i];
      const userAnswer = answers[i];
      
      if (question && userAnswer && question.correctAnswer === userAnswer) {
        correctAnswers++;
      }
    }

    // Calculate percentage score
    const quizScore = Math.round((correctAnswers / totalQuestions) * 100);

    // Update the assessment with the score
    const updatedAssessment = await db.assessment.update({
      where: {
        id: assessmentId,
        userId: user.id, // Ensure user can only update their own assessments
      },
      data: {
        quizScore: quizScore,
        // Removed completedAt field as it doesn't exist in the schema
      },
    });

    // Create a detailed result object with only serializable data
    const result = {
      id: updatedAssessment.id,
      quizScore: updatedAssessment.quizScore,
      category: updatedAssessment.category,
      createdAt: updatedAssessment.createdAt,
      updatedAt: updatedAssessment.updatedAt,
      questions: assessment.questions.map((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        // Get the correct answer text from the options array
        let correctAnswerText = question.correctAnswer;
        if (question.options && question.correctAnswer) {
          // Convert letter answer (A, B, C, D) to the actual text
          const answerIndex = question.correctAnswer.charCodeAt(0) - 65; // A=0, B=1, etc.
          if (answerIndex >= 0 && answerIndex < question.options.length) {
            correctAnswerText = question.options[answerIndex];
          }
        }
        
        return {
          question: question.question,
          userAnswer: userAnswer,
          correctAnswerText: correctAnswerText,
          isCorrect: isCorrect,
          explanation: question.explanation
        };
      }),
      improvementTip: "Review the questions you answered incorrectly and study the explanations provided."
    };

    return result;
  } catch (error) {
    console.error("Error submitting assessment answers:", error);
    throw new Error("Failed to submit assessment answers");
  }
}

export async function deleteAssessment(id) {
  // Use checkAuth instead of requireAuth
  const { user, userId } = await checkAuth();

  // If not authenticated, return early
  if (!userId || !user) {
    throw new Error("Authentication required");
  }

  try {
    // First check if the assessment exists and belongs to the current user
    const existingAssessment = await db.assessment.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    // If assessment doesn't exist or doesn't belong to the user, throw a specific error
    if (!existingAssessment) {
      throw new Error("Assessment not found or you don't have permission to delete it");
    }

    // Delete the assessment
    const deletedAssessment = await db.assessment.delete({
      where: {
        id,
        userId: user.id, // Ensure the assessment belongs to the current user
      },
    });

    return deletedAssessment;
  } catch (error) {
    console.error("Error deleting assessment:", error);
    // Handle the specific Prisma error for record not found
    if (error.code === 'P2025') {
      throw new Error("Assessment not found or you don't have permission to delete it");
    }
    throw new Error("Failed to delete assessment");
  }
}
