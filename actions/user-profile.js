"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get the current user's full profile information
 * @returns {Promise<Object|null>} The user's profile data or null if not found
 */
export async function getCurrentUserProfile() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { 
        clerkUserId: userId 
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}