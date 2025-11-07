import { getCurrentUserProfile } from "@/actions/user-profile";

export async function GET() {
  try {
    const profile = await getCurrentUserProfile();
    
    if (!profile) {
      return Response.json({
        success: false,
        message: "User profile not found"
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      profile: {
        id: profile.id,
        industry: profile.industry,
        experience: profile.experience,
        skills: profile.skills,
        createdAt: profile.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message
    }, { status: 500 });
  }
}