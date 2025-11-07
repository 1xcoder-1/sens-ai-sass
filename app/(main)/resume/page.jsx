import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";
import { redirect } from "next/navigation";

export default async function ResumePage() {
  let resume = null;
  
  try {
    resume = await getResume();
  } catch (error) {
    // If there's an auth error, redirect to sign in
    if (error.message === "Authentication required") {
      redirect("/sign-in");
    }
    // For other errors, we'll just show an empty resume builder
    console.error("Error loading resume:", error);
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}