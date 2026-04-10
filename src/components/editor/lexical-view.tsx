import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function LoadInitialContent({ initialContent }: { initialContent: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialContent) return;
    const parsed = JSON.parse(initialContent);
    editor.update(() => {
      const editorState = editor.parseEditorState(parsed);
      editor.setEditorState(editorState);
    });
  }, [editor, initialContent]);

  return null;
}

export function LexicalView({ content }: { content: string }) {
  const initialConfig = {
    namespace: "CommentViewer",
    editable: false,
    onError: (error: Error) => console.error(error),
    theme: {
      paragraph: "mb-2"
    }
  };

  return (
    <div className="prose prose-sm max-w-none bg-muted/50 p-3 rounded-md">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={null}
        />
        <HistoryPlugin />
        <LoadInitialContent initialContent={content} />
      </LexicalComposer>
    </div>
  );
}