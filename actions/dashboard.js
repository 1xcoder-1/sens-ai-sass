"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) {
    // Return default insights if user is not authenticated
    return {
      industry: "Technology",
      salaryRanges: [
        { role: "Software Engineer", min: 70000, max: 150000, median: 100000, location: "United States" },
        { role: "Product Manager", min: 90000, max: 180000, median: 130000, location: "United States" },
        { role: "Data Scientist", min: 80000, max: 160000, median: 120000, location: "United States" },
        { role: "UX Designer", min: 60000, max: 130000, median: 95000, location: "United States" },
        { role: "DevOps Engineer", min: 85000, max: 170000, median: 125000, location: "United States" }
      ],
      growthRate: 12.5,
      demandLevel: "High",
      topSkills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
      marketOutlook: "Positive",
      keyTrends: [
        "Remote work opportunities",
        "AI and machine learning integration",
        "Cloud computing adoption",
        "Cybersecurity focus",
        "Agile development practices"
      ],
      recommendedSkills: ["Cloud Computing", "AI/ML", "Cybersecurity", "Agile", "DevOps"],
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      // Return default insights if user is not found in database
      return {
        industry: "Technology",
        salaryRanges: [
          { role: "Software Engineer", min: 70000, max: 150000, median: 100000, location: "United States" },
          { role: "Product Manager", min: 90000, max: 180000, median: 130000, location: "United States" },
          { role: "Data Scientist", min: 80000, max: 160000, median: 120000, location: "United States" },
          { role: "UX Designer", min: 60000, max: 130000, median: 95000, location: "United States" },
          { role: "DevOps Engineer", min: 85000, max: 170000, median: 125000, location: "United States" }
        ],
        growthRate: 12.5,
        demandLevel: "High",
        topSkills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
        marketOutlook: "Positive",
        keyTrends: [
          "Remote work opportunities",
          "AI and machine learning integration",
          "Cloud computing adoption",
          "Cybersecurity focus",
          "Agile development practices"
        ],
        recommendedSkills: ["Cloud Computing", "AI/ML", "Cybersecurity", "Agile", "DevOps"],
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    }

    // Use user's industry or default to Technology
    const industry = user.industry || "Technology";

    // Try to find existing industry insights
    const existingInsights = await db.industryInsight.findUnique({
      where: { industry: industry },
    });

    // If insights exist, return them
    if (existingInsights) {
      return existingInsights;
    }

    // If no insights exist, generate them
    try {
      const insights = await generateAIInsights(industry);
      
      // Create or update the industry insights
      const industryInsight = await db.industryInsight.upsert({
        where: { industry: industry },
        update: {
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          industry: industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return industryInsight;
    } catch (aiError) {
      console.error("Error generating AI insights:", aiError);
      // Return default insights if AI generation fails
      return {
        industry: industry,
        salaryRanges: [
          { role: "Software Engineer", min: 70000, max: 150000, median: 100000, location: "United States" },
          { role: "Product Manager", min: 90000, max: 180000, median: 130000, location: "United States" },
          { role: "Data Scientist", min: 80000, max: 160000, median: 120000, location: "United States" },
          { role: "UX Designer", min: 60000, max: 130000, median: 95000, location: "United States" },
          { role: "DevOps Engineer", min: 85000, max: 170000, median: 125000, location: "United States" }
        ],
        growthRate: 12.5,
        demandLevel: "High",
        topSkills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
        marketOutlook: "Positive",
        keyTrends: [
          "Remote work opportunities",
          "AI and machine learning integration",
          "Cloud computing adoption",
          "Cybersecurity focus",
          "Agile development practices"
        ],
        recommendedSkills: ["Cloud Computing", "AI/ML", "Cybersecurity", "Agile", "DevOps"],
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    }
  } catch (error) {
    console.error("Error getting industry insights:", error);
    // Return default insights if there's an error
    return {
      industry: "Technology",
      salaryRanges: [
        { role: "Software Engineer", min: 70000, max: 150000, median: 100000, location: "United States" },
        { role: "Product Manager", min: 90000, max: 180000, median: 130000, location: "United States" },
        { role: "Data Scientist", min: 80000, max: 160000, median: 120000, location: "United States" },
        { role: "UX Designer", min: 60000, max: 130000, median: 95000, location: "United States" },
        { role: "DevOps Engineer", min: 85000, max: 170000, median: 125000, location: "United States" }
      ],
      growthRate: 12.5,
      demandLevel: "High",
      topSkills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
      marketOutlook: "Positive",
      keyTrends: [
        "Remote work opportunities",
        "AI and machine learning integration",
        "Cloud computing adoption",
        "Cybersecurity focus",
        "Agile development practices"
      ],
      recommendedSkills: ["Cloud Computing", "AI/ML", "Cybersecurity", "Agile", "DevOps"],
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }
}