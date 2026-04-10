"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useComments } from "@/hooks/useComments";
import RichTextEditor from "@/components/editor/rich-text-editor";
import { LexicalView } from "@/components/editor/lexical-view";

interface CommentSectionProps {
  taskId: string;
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const { data: session } = useSession();
  const { comments, isLoading, isSubmitting, addComment, deleteComment } = useComments(taskId);
  const [editorContent, setEditorContent] = useState<string>("");

  const handleSubmitComment = async () => {
    if (!editorContent.trim() || isSubmitting) return;

    const success = await addComment(editorContent);
    if (success) {
      setEditorContent("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Input */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="text-xs">
                  {session?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="border rounded-md overflow-hidden">
                  <RichTextEditor
                    onSerializedChange={(value) => {
                      setEditorContent(JSON.stringify(value));
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !editorContent.trim()}
                    size="sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatarUrl || ""} alt={comment.user.name || ""} />
                    <AvatarFallback className="text-xs">
                      {comment.user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.user.name || "Unknown User"}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {session?.user?.id === comment.userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteComment(comment.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <LexicalView content={comment.content} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
