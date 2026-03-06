import { createEditor } from "@/utils/whiteboard";
import { useLayoutEffect, useRef, useState } from "react";

export default function useEditor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<ReturnType<typeof createEditor> | null>(
    null
  );

  useLayoutEffect(() => {
    if (!ref.current) return;

    const editor = createEditor({ container: ref.current });

    editor.mount();

    setEditor(editor);

    return () => editor.unmount();
  }, []);

  return {
    ref,
    editor,
  };
}
