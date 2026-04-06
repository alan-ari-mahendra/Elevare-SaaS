import { User } from "@prisma/client";

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/user/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error in fetchCurrentUser:", error);
    return null;
  }
}