"use client";

import { useEffect, useState } from "react";

import useCanvas from "@/hooks/useEditor";
import { DragTool } from "@/utils/whiteboard/tools/drag";
import { AddTool } from "@/utils/whiteboard/tools/add";
import { SelectTool } from "@/utils/whiteboard/tools/select";

export default function Notes() {
  const { ref, editor } = useCanvas();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!editor) return;

    if (isMounted) return;

    editor.addShape({
      type: "rectangle",
      id: crypto.randomUUID(),
      height: 100,
      width: 100,
      x: 500,
      y: 250,
      isSelectable: true,
    });

    editor.registerTool(new AddTool("add"));
    editor.registerTool(new DragTool("drag"));
    editor.registerTool(new SelectTool("select"));

    setIsMounted(true);
  }, [editor, isMounted]);

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <header>
        <ul className="flex gap-2">
          <li>
            <button
              className="border rounded-sm px-4 py-2 min-w-20"
              onClick={() => {
                if (!editor) return;
                editor.setActiveTool("add");
              }}
            >
              Add
            </button>
          </li>
          <li>
            <button
              className="border rounded-sm px-4 py-2 min-w-20"
              onClick={() => {
                if (!editor) return;
                editor.setActiveTool("drag");
              }}
            >
              Drag
            </button>
          </li>
          <li>
            <button
              className="border rounded-sm px-4 py-2 min-w-20"
              onClick={() => {
                if (!editor) return;
                editor.setActiveTool("select");
              }}
            >
              Select
            </button>
          </li>
        </ul>
      </header>
      <section className="flex-1">
        <div
          ref={ref}
          className="w-full h-full relative border overflow-hidden"
        />
      </section>
    </div>
  );
}
