"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-00/editor";

interface RichTextEditorProps {
  editorSerializedState?: SerializedEditorState;
  onSerializedChange?: (value: SerializedEditorState) => void;
  placeholder?: string;
}

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1
          }
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1
      }
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1
  }
} as unknown as SerializedEditorState;

export default function RichTextEditor({
                                         editorSerializedState = initialValue,
                                         onSerializedChange,
                                         placeholder = "Write a comment..."
                                       }: RichTextEditorProps) {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(editorSerializedState);

  const handleSerializedChange = (value: SerializedEditorState) => {
    setEditorState(value);
    onSerializedChange?.(value);
  };

  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={handleSerializedChange}
      placeholder={placeholder}
    />
  );
}