import { User } from "@prisma/client";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/user/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}