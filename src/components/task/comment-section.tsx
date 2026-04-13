"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="border-border/50">
        <CardContent className="pt-5 space-y-5">
          <p className="text-sm font-medium">Comments</p>

          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
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
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group flex items-start gap-3">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={comment.user.avatarUrl || ""} alt={comment.user.name || ""} />
                    <AvatarFallback className="text-[10px]">
                      {comment.user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.user.name || "Unknown User"}</span>
                      <span className="text-[11px] text-muted-foreground/70">
                        {formatDate(comment.createdAt)}
                      </span>
                      {session?.user?.id === comment.userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteComment(comment.id)}
                          className="h-6 w-6 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-1">
                      <LexicalView content={comment.content} />
                    </div>
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
