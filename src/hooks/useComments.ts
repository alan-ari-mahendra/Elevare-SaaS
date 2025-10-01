import { useState, useEffect } from "react";
import { Comment } from "@prisma/client";

export function useComments(taskId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add comment:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete comment:", error);
      return false;
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  return {
    comments,
    isLoading,
    isSubmitting,
    addComment,
    deleteComment,
  };
}