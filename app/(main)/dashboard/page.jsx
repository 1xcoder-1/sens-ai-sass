import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { getResume } from "@/actions/resume";
import { getCoverLetters } from "@/actions/cover-letter";
import { getAssessments } from "@/actions/interview";
import { getUserRoadmaps } from "@/actions/roadmap";

export default async function DashboardPage() {
  let isOnboarded = false;
  
  try {
    const onboardingStatus = await getUserOnboardingStatus();
    isOnboarded = onboardingStatus.isOnboarded;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // If there's an error checking onboarding status, redirect to onboarding
    isOnboarded = false;
  }

  // If not onboarded, redirect to onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  try {
    const insights = await getIndustryInsights();
    
    // Handle potential auth errors for resume
    let resume = null;
    try {
      resume = await getResume();
    } catch (error) {
      if (error.message === "Authentication required") {
        redirect("/sign-in");
      }
      console.error("Error loading resume:", error);
    }
    
    // Handle potential auth errors for cover letters
    let coverLetters = [];
    try {
      coverLetters = await getCoverLetters();
    } catch (error) {
      if (error.message === "Authentication required") {
        redirect("/sign-in");
      }
      console.error("Error loading cover letters:", error);
    }
    
    // Handle potential auth errors for assessments
    let assessments = [];
    try {
      assessments = await getAssessments();
    } catch (error) {
      if (error.message === "Authentication required") {
        redirect("/sign-in");
      }
      console.error("Error loading assessments:", error);
    }
    
    // Handle potential auth errors for roadmaps
    let roadmaps = [];
    try {
      roadmaps = await getUserRoadmaps();
    } catch (error) {
      if (error.message === "Authentication required") {
        redirect("/sign-in");
      }
      console.error("Error loading roadmaps:", error);
      roadmaps = []; // Default to empty array if roadmaps fail to load
    }

    const initialData = {
      insights,
      resume,
      coverLetters,
      assessments,
      roadmaps
    };

    return (
      <div className="container mx-auto px-4 py-6">
        <DashboardView {...initialData} />
      </div>
    );
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // If there's an error loading dashboard data, redirect to onboarding
    redirect("/onboarding");
  }
}