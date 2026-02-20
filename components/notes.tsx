"use client";

import useCanvas from "@/hooks/useEditor";
import { normalizePointerEvent } from "@/utils/whiteboard/utils";

export default function Notes() {
  const { ref, editor } = useCanvas();

  return (
    <section className="w-full h-full">
      <div
        ref={ref}
        className="w-full h-full relative border"
        onClick={(event) => {
          const target = normalizePointerEvent(event);

          if (!target) return;

          editor?.addShape({
            type: "rectangle",
            id: crypto.randomUUID(),
            height: 100,
            width: 100,
            ...target,
          });
        }}
      />
    </section>
  );
}
