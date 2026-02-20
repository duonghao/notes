import { DOMRenderer } from "@/utils/whiteboard/DOMRenderer";
import { createEditor, Editor } from "@/utils/whiteboard/editor";
import { useLayoutEffect, useRef, useState } from "react";

export default function useEditor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const _editor = createEditor({
      renderer: new DOMRenderer(),
    });

    _editor.mount(ref.current);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditor(_editor);

    return () => _editor.destroy();
  }, []);

  return {
    ref,
    editor,
  };
}
