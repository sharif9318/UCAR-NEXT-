import React, { forwardRef, useImperativeHandle } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

interface TuiEditorProps {
  initialValue?: string;
  placeholder?: string;
}

const TuiEditor = forwardRef<Editor, TuiEditorProps>((props, ref) => {
  const { initialValue = "Type here", placeholder = "Type here" } = props;

  const editorRef = React.useRef<Editor>(null);

  // Expose the editor instance to parent component
  useImperativeHandle(ref, () => editorRef.current!, []);

  return (
    <Editor
      initialValue={initialValue}
      placeholder={placeholder}
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      toolbarItems={[
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task"],
        ["table", "link"],
        ["code", "codeblock"],
      ]}
      ref={editorRef}
    />
  );
});

TuiEditor.displayName = "TuiEditor";

export default TuiEditor;
